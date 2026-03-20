import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-inventory-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory-page.html',
  styleUrl: './admin-inventory-page.css'
})
export class AdminInventoryPage {
  itemName = '';
  linkedService = '';
  currentStock = 0;

  items = [
    { name: 'Syringe 5ml', linkedService: 'Vaccination', stock: 8, status: 'Low Stock' },
    { name: 'Gloves', linkedService: 'General Check Up', stock: 60, status: 'In Stock' },
    { name: 'Alcohol', linkedService: 'Laboratory Tests', stock: 5, status: 'Low Stock' }
  ];

  addItem(): void {
    if (!this.itemName || !this.linkedService || !this.currentStock) return;

    this.items.unshift({
      name: this.itemName,
      linkedService: this.linkedService,
      stock: this.currentStock,
      status: this.currentStock <= 10 ? 'Low Stock' : 'In Stock'
    });

    this.itemName = '';
    this.linkedService = '';
    this.currentStock = 0;
  }

  restock(item: { stock: number; status: string }): void {
    item.stock += 10;
    item.status = item.stock <= 10 ? 'Low Stock' : 'In Stock';
  }
}