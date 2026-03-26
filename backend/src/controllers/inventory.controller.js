import { successResponse } from '../utils/response.js';

export const getInventory = async (req, res, next) => {
  try {
    return successResponse(res, 'Inventory fetched', [
      {
        id: 1,
        itemName: 'Syringe 5ml',
        linkedService: 'Vaccination',
        currentStock: 8,
        lowStockThreshold: 10,
        status: 'Low Stock'
      }
    ]);
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req, res, next) => {
  try {
    return successResponse(res, 'Inventory item created', null, 201);
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    return successResponse(res, 'Inventory item updated');
  } catch (error) {
    next(error);
  }
};