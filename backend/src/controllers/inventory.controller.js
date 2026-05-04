import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const computeStatus = (currentStock, lowStockThreshold) => {
  if (currentStock <= 0) return 'Low Stock';
  if (currentStock <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
};

export const getInventory = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         item_name,
         linked_service,
         current_stock,
         low_stock_threshold,
         status,
         created_at,
         updated_at
       FROM inventory_items
       ORDER BY item_name ASC`
    );

    return successResponse(res, 'Inventory fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const getInventoryLogs = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         l.id,
         i.item_name,
         l.action_type,
         l.quantity,
         l.remarks,
         l.created_at
       FROM inventory_logs l
       INNER JOIN inventory_items i ON i.id = l.inventory_item_id
       ORDER BY l.created_at DESC`
    );

    return successResponse(res, 'Inventory logs fetched', rows);
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req, res, next) => {
  try {
    const { itemName, linkedService, currentStock, lowStockThreshold } = req.body;

    if (!itemName) {
      return errorResponse(res, 'Item name is required', 400);
    }

    const stock = Number(currentStock || 0);
    const threshold = Number(lowStockThreshold || 10);
    const status = computeStatus(stock, threshold);

    const [result] = await pool.query(
      `INSERT INTO inventory_items (
         item_name,
         linked_service,
         current_stock,
         low_stock_threshold,
         status
       ) VALUES (?, ?, ?, ?, ?)`,
      [itemName, linkedService || null, stock, threshold, status]
    );

    await pool.query(
      `INSERT INTO inventory_logs (
         inventory_item_id,
         action_type,
         quantity,
         remarks
       ) VALUES (?, 'Added', ?, ?)`,
      [result.insertId, stock, 'Initial inventory item creation']
    );

    return successResponse(res, 'Inventory item created', {
      id: result.insertId
    });
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
    const status = computeStatus(stock, threshold);

    await pool.query(
      `UPDATE inventory_items
       SET item_name = ?,
           linked_service = ?,
           current_stock = ?,
           low_stock_threshold = ?,
           status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [itemName, linkedService || null, stock, threshold, status, id]
    );

    await pool.query(
      `INSERT INTO inventory_logs (
         inventory_item_id,
         action_type,
         quantity,
         remarks
       ) VALUES (?, 'Updated', ?, ?)`,
      [id, stock, 'Inventory item updated']
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
      return errorResponse(res, 'Restock quantity must be greater than 0', 400);
    }

    const [rows] = await pool.query(
      `SELECT id, current_stock, low_stock_threshold
       FROM inventory_items
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return errorResponse(res, 'Inventory item not found', 404);
    }

    const item = rows[0];
    const newStock = Number(item.current_stock) + qty;
    const status = computeStatus(newStock, Number(item.low_stock_threshold));

    await pool.query(
      `UPDATE inventory_items
       SET current_stock = ?,
           status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newStock, status, id]
    );

    await pool.query(
      `INSERT INTO inventory_logs (
         inventory_item_id,
         action_type,
         quantity,
         remarks
       ) VALUES (?, 'Restocked', ?, ?)`,
      [id, qty, 'Inventory restocked']
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
       SET status = 'Archived',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );

    await pool.query(
      `INSERT INTO inventory_logs (
         inventory_item_id,
         action_type,
         quantity,
         remarks
       ) VALUES (?, 'Archived', 0, ?)`,
      [id, 'Inventory item archived']
    );

    return successResponse(res, 'Inventory item archived');
  } catch (error) {
    next(error);
  }
};