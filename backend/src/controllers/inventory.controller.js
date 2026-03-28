import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const computeInventoryStatus = (stock, threshold) => {
  return stock <= threshold ? 'Low Stock' : 'In Stock';
};

export const getInventory = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM inventory_items ORDER BY id DESC'
    );

    return successResponse(res, 'Inventory fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req, res, next) => {
  try {
    const { itemName, linkedService, currentStock, lowStockThreshold } = req.body;

    if (!itemName || !linkedService) {
      return errorResponse(res, 'Missing required inventory fields', 400);
    }

    const stock = Number(currentStock || 0);
    const threshold = Number(lowStockThreshold || 10);
    const status = computeInventoryStatus(stock, threshold);

    const [result] = await pool.query(
      `INSERT INTO inventory_items
      (
        item_name,
        linked_service,
        current_stock,
        low_stock_threshold,
        status
      )
      VALUES (?, ?, ?, ?, ?)`,
      [itemName, linkedService, stock, threshold, status]
    );

    await pool.query(
      `INSERT INTO inventory_logs
      (
        inventory_item_id,
        action_type,
        quantity,
        remarks
      )
      VALUES (?, ?, ?, ?)`,
      [result.insertId, 'Added', stock, 'Initial inventory item creation']
    );

    return successResponse(res, 'Inventory item created', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemName, linkedService, currentStock, lowStockThreshold } = req.body;

    const stock = Number(currentStock || 0);
    const threshold = Number(lowStockThreshold || 10);
    const status = computeInventoryStatus(stock, threshold);

    await pool.query(
      `UPDATE inventory_items
       SET
         item_name = ?,
         linked_service = ?,
         current_stock = ?,
         low_stock_threshold = ?,
         status = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [itemName, linkedService, stock, threshold, status, id]
    );

    await pool.query(
      `INSERT INTO inventory_logs
      (
        inventory_item_id,
        action_type,
        quantity,
        remarks
      )
      VALUES (?, ?, ?, ?)`,
      [id, 'Updated', stock, 'Inventory item updated']
    );

    return successResponse(res, 'Inventory item updated');
  } catch (error) {
    next(error);
  }
};

export const restockInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity || 0);

    if (qty <= 0) {
      return errorResponse(res, 'Restock quantity must be greater than zero', 400);
    }

    const [rows] = await pool.query(
      'SELECT current_stock, low_stock_threshold FROM inventory_items WHERE id = ? LIMIT 1',
      [id]
    );

    if (!rows.length) {
      return errorResponse(res, 'Inventory item not found', 404);
    }

    const newStock = Number(rows[0].current_stock) + qty;
    const status = computeInventoryStatus(newStock, rows[0].low_stock_threshold);

    await pool.query(
      `UPDATE inventory_items
       SET current_stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newStock, status, id]
    );

    await pool.query(
      `INSERT INTO inventory_logs
      (
        inventory_item_id,
        action_type,
        quantity,
        remarks
      )
      VALUES (?, ?, ?, ?)`,
      [id, 'Restocked', qty, 'Inventory restocked']
    );

    return successResponse(res, 'Inventory item restocked');
  } catch (error) {
    next(error);
  }
};

export const archiveInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE inventory_items
       SET status = 'Archived', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    await pool.query(
      `INSERT INTO inventory_logs
      (
        inventory_item_id,
        action_type,
        quantity,
        remarks
      )
      VALUES (?, ?, ?, ?)`,
      [id, 'Archived', 0, 'Inventory item archived']
    );

    return successResponse(res, 'Inventory item archived');
  } catch (error) {
    next(error);
  }
};

export const getInventoryLogs = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         il.id,
         ii.item_name,
         il.action_type,
         il.quantity,
         il.remarks,
         il.created_at
       FROM inventory_logs il
       INNER JOIN inventory_items ii ON ii.id = il.inventory_item_id
       ORDER BY il.id DESC`
    );

    return successResponse(res, 'Inventory logs fetched', rows);
  } catch (error) {
    next(error);
  }
};