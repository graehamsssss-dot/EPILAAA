import { pool } from '../config/db.js';
import { successResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const [
      queueRowsResult,
      lowStockRowsResult,
      completedTodayRowsResult,
      reportsRowsResult
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS total
         FROM patient_queue
         WHERE status IN ('Waiting', 'In Progress')`
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM inventory_items
         WHERE status = 'Low Stock'`
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM bookings
         WHERE status = 'Completed'
           AND DATE(updated_at) = CURDATE()`
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM monthly_reports`
      )
    ]);

    const queueRow = queueRowsResult[0][0];
    const lowStockRow = lowStockRowsResult[0][0];
    const completedTodayRow = completedTodayRowsResult[0][0];
    const reportsRow = reportsRowsResult[0][0];

    return successResponse(res, 'Dashboard summary fetched', {
      patientsInQueue: Number(queueRow?.total || 0),
      lowStockItems: Number(lowStockRow?.total || 0),
      reports: Number(reportsRow?.total || 0),
      completedToday: Number(completedTodayRow?.total || 0)
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const range = req.query.range || 'monthly';

    let bookingWhereClause = '';
    if (range === 'weekly') {
      bookingWhereClause = `
        WHERE YEARWEEK(b.booking_date, 1) = YEARWEEK(CURDATE(), 1)
      `;
    } else {
      bookingWhereClause = `
        WHERE YEAR(b.booking_date) = YEAR(CURDATE())
          AND MONTH(b.booking_date) = MONTH(CURDATE())
      `;
    }

    const [
      monthlyRowsResult,
      serviceRowsResult,
      upcomingQueueRowsResult,
      lowStockRowsResult,
      waitingRowsResult
    ] = await Promise.all([
      pool.query(
        `SELECT
           DATE_FORMAT(b.booking_date, '%b %d') AS label,
           b.booking_date AS sortDate,
           COUNT(*) AS total
         FROM bookings b
         ${bookingWhereClause}
         GROUP BY b.booking_date, DATE_FORMAT(b.booking_date, '%b %d')
         ORDER BY b.booking_date ASC`
      ),
      pool.query(
        `SELECT
           s.service_name AS label,
           COUNT(b.id) AS value
         FROM services s
         LEFT JOIN bookings b
           ON b.service_id = s.id
           ${bookingWhereClause.replace('WHERE', 'AND')}
         GROUP BY s.id, s.service_name
         HAVING COUNT(b.id) > 0
         ORDER BY value DESC
         LIMIT 5`
      ),
      pool.query(
        `SELECT
           pq.id,
           pq.booking_id,
           pq.queue_number,
           pq.status,
           b.booking_date,
           b.booking_time,
           s.service_name,
           CONCAT(
             p.first_name,
             ' ',
             COALESCE(p.middle_name, ''),
             CASE
               WHEN p.middle_name IS NOT NULL AND p.middle_name != '' THEN ' '
               ELSE ''
             END,
             p.last_name
           ) AS patient_name
         FROM patient_queue pq
         INNER JOIN bookings b ON b.id = pq.booking_id
         INNER JOIN patients p ON p.id = b.patient_id
         INNER JOIN services s ON s.id = b.service_id
         WHERE pq.status IN ('Waiting', 'In Progress')
         ORDER BY b.booking_date ASC, b.booking_time ASC
         LIMIT 5`
      ),
      pool.query(
        `SELECT item_name, current_stock, low_stock_threshold
         FROM inventory_items
         WHERE status = 'Low Stock'
         ORDER BY current_stock ASC
         LIMIT 5`
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM patient_queue
         WHERE status = 'Waiting'`
      )
    ]);

    const monthlyRows = monthlyRowsResult[0];
    const serviceRows = serviceRowsResult[0];
    const upcomingQueueRows = upcomingQueueRowsResult[0];
    const lowStockRows = lowStockRowsResult[0];
    const waitingRows = waitingRowsResult[0];

    const reminders = [];

    if (Number(waitingRows[0]?.total || 0) > 0) {
      reminders.push(`${waitingRows[0].total} patient(s) are still waiting in queue.`);
    }

    if (lowStockRows.length > 0) {
      reminders.push(`${lowStockRows.length} inventory item(s) are low stock.`);
    }

    if (!reminders.length) {
      reminders.push('All core admin activities look normal today.');
    }

    return successResponse(res, 'Dashboard analytics fetched', {
      selectedRange: range,
      monthlyConsultations: monthlyRows.map((item) => ({
        label: item.label,
        value: Number(item.total)
      })),
      serviceDistribution: serviceRows.map((item) => ({
        label: item.label,
        value: Number(item.value)
      })),
      upcomingQueue: upcomingQueueRows.map((item) => ({
        ...item
      })),
      reminders,
      lowStockItems: lowStockRows.map((item) => ({
        itemName: item.item_name,
        currentStock: Number(item.current_stock),
        lowStockThreshold: Number(item.low_stock_threshold)
      }))
    });
  } catch (error) {
    next(error);
  }
};