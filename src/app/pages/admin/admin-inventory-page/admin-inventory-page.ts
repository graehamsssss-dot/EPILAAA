import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../../core/services/api-admin.service';
import { InventoryItem, InventoryLogItem } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-inventory-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory-page.html',
  styleUrl: './admin-inventory-page.css'
})
export class AdminInventoryPage implements OnInit {
  items: InventoryItem[] = [];
  logs: InventoryLogItem[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  restockAmount = 10;
  editMode = false;
  editingId: number | null = null;

  form = {
    itemName: '',
    linkedService: '',
    currentStock: 0,
    lowStockThreshold: 10
  };

  constructor(private apiAdminService: ApiAdminService) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadLogs();
  }

  loadInventory(): void {
    this.isLoading = true;

    this.apiAdminService.getInventory().subscribe({
      next: (response) => {
        this.items = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to load inventory.';
        this.isLoading = false;
      }
    });
  }

  loadLogs(): void {
    this.apiAdminService.getInventoryLogs().subscribe({
      next: (response) => {
        this.logs = response.data;
      }
    });
  }

  get filteredItems(): InventoryItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return this.items;

    return this.items.filter(item =>
      item.item_name.toLowerCase().includes(term) ||
      item.linked_service.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }

  saveItem(): void {
    const payload = {
      itemName: this.form.itemName,
      linkedService: this.form.linkedService,
      currentStock: this.form.currentStock,
      lowStockThreshold: this.form.lowStockThreshold
    };

    if (this.editMode && this.editingId !== null) {
      this.apiAdminService.updateInventoryItem(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Inventory item updated.';
          this.resetForm();
          this.loadInventory();
          this.loadLogs();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to update inventory item.';
        }
      });
    } else {
      this.apiAdminService.createInventoryItem(payload).subscribe({
        next: () => {
          this.successMessage = 'Inventory item created.';
          this.resetForm();
          this.loadInventory();
          this.loadLogs();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to create inventory item.';
        }
      });
    }
  }

  editItem(item: InventoryItem): void {
    this.form = {
      itemName: item.item_name,
      linkedService: item.linked_service,
      currentStock: item.current_stock,
      lowStockThreshold: item.low_stock_threshold
    };
    this.editMode = true;
    this.editingId = item.id;
  }

  restockItem(item: InventoryItem): void {
    this.apiAdminService.restockInventoryItem(item.id, this.restockAmount).subscribe({
      next: () => {
        this.successMessage = 'Inventory item restocked.';
        this.loadInventory();
        this.loadLogs();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to restock inventory.';
      }
    });
  }

  archiveItem(item: InventoryItem): void {
    this.apiAdminService.archiveInventoryItem(item.id).subscribe({
      next: () => {
        this.successMessage = 'Inventory item archived.';
        this.loadInventory();
        this.loadLogs();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to archive inventory.';
      }
    });
  }

  resetForm(): void {
    this.form = {
      itemName: '',
      linkedService: '',
      currentStock: 0,
      lowStockThreshold: 10
    };
    this.editMode = false;
    this.editingId = null;
  }
}