import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Archived';

interface InventoryItem {
  id: number;
  itemName: string;
  linkedService: string;
  currentStock: number;
  lowStockThreshold: number;
  status: InventoryStatus;
}

interface InventoryLog {
  id: number;
  itemName: string;
  action: string;
  quantity: number;
  date: string;
}

@Component({
  selector: 'app-admin-inventory-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory-page.html',
  styleUrl: './admin-inventory-page.css'
})
export class AdminInventoryPage {
  searchTerm = '';
  editMode = false;
  editingId: number | null = null;
  restockAmount = 10;

  serviceOptions = [
    'Vaccination',
    'Dental Care',
    'Maternal',
    'STD Test',
    'Animal Related / Anti-Rabies',
    'Laboratory Tests',
    'General Check Up',
    'Other'
  ];

  items: InventoryItem[] = [
    {
      id: 1,
      itemName: 'Syringe 5ml',
      linkedService: 'Vaccination',
      currentStock: 8,
      lowStockThreshold: 10,
      status: 'Low Stock'
    },
    {
      id: 2,
      itemName: 'Gloves',
      linkedService: 'General Check Up',
      currentStock: 60,
      lowStockThreshold: 15,
      status: 'In Stock'
    },
    {
      id: 3,
      itemName: 'Alcohol',
      linkedService: 'Laboratory Tests',
      currentStock: 5,
      lowStockThreshold: 10,
      status: 'Low Stock'
    },
    {
      id: 4,
      itemName: 'Dental Kit',
      linkedService: 'Dental Care',
      currentStock: 25,
      lowStockThreshold: 8,
      status: 'In Stock'
    }
  ];

  logs: InventoryLog[] = [
    { id: 1, itemName: 'Syringe 5ml', action: 'Restocked', quantity: 20, date: '2026-03-20' },
    { id: 2, itemName: 'Alcohol', action: 'Used', quantity: 5, date: '2026-03-20' },
    { id: 3, itemName: 'Gloves', action: 'Added', quantity: 60, date: '2026-03-19' }
  ];

  form: InventoryItem = this.createEmptyForm();

  createEmptyForm(): InventoryItem {
    return {
      id: 0,
      itemName: '',
      linkedService: 'General Check Up',
      currentStock: 0,
      lowStockThreshold: 10,
      status: 'In Stock'
    };
  }

  get filteredItems(): InventoryItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.items;
    }

    return this.items.filter(item =>
      item.itemName.toLowerCase().includes(term) ||
      item.linkedService.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }

  get lowStockItems(): InventoryItem[] {
    return this.items.filter(item => item.status === 'Low Stock');
  }

  saveItem(): void {
    if (!this.form.itemName || !this.form.linkedService) {
      return;
    }

    this.form.status = this.computeStatus(this.form.currentStock, this.form.lowStockThreshold);

    if (this.editMode && this.editingId !== null) {
      this.items = this.items.map(item =>
        item.id === this.editingId ? { ...this.form, id: this.editingId } : item
      );

      this.addLog(this.form.itemName, 'Updated', this.form.currentStock);
    } else {
      const newItem: InventoryItem = {
        ...this.form,
        id: Date.now()
      };
      this.items.unshift(newItem);
      this.addLog(newItem.itemName, 'Added', newItem.currentStock);
    }

    this.resetForm();
  }

  editItem(item: InventoryItem): void {
    this.form = { ...item };
    this.editMode = true;
    this.editingId = item.id;
  }

  restockItem(item: InventoryItem): void {
    item.currentStock += this.restockAmount;
    item.status = this.computeStatus(item.currentStock, item.lowStockThreshold);
    this.addLog(item.itemName, 'Restocked', this.restockAmount);
  }

  archiveItem(item: InventoryItem): void {
    item.status = 'Archived';
    this.addLog(item.itemName, 'Archived', 0);
  }

  resetForm(): void {
    this.form = this.createEmptyForm();
    this.editMode = false;
    this.editingId = null;
  }

  computeStatus(stock: number, threshold: number): InventoryStatus {
    if (stock <= threshold) {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  addLog(itemName: string, action: string, quantity: number): void {
    this.logs.unshift({
      id: Date.now(),
      itemName,
      action,
      quantity,
      date: new Date().toISOString().slice(0, 10)
    });
  }

  getStatusClass(status: InventoryStatus): string {
    return `status ${status.toLowerCase().replace(/\s+/g, '-')}`;
  }
}