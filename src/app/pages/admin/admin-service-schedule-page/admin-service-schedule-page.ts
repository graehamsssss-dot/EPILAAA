import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../../core/services/api-admin.service';
import { ServiceItem } from '../../../core/models/service.models';

@Component({
  selector: 'app-admin-service-schedule-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-service-schedule-page.html',
  styleUrl: './admin-service-schedule-page.css'
})
export class AdminServiceSchedulePage implements OnInit {
  services: ServiceItem[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  categories = [
    'vaccination',
    'dental care',
    'maternal',
    'std test',
    'animal related / anti-rabies',
    'laboratory tests',
    'general check up',
    'other'
  ];

  form: any = this.createEmptyForm();
  editMode = false;
  editingId: number | null = null;
  searchTerm = '';

  constructor(private apiAdminService: ApiAdminService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  createEmptyForm() {
    return {
      serviceName: '',
      category: 'general check up',
      description: '',
      availableDays: '',
      startTime: '',
      endTime: '',
      slotLimit: 0,
      status: 'Active',
      linkedInventoryItems: ''
    };
  }

  loadServices(): void {
    this.isLoading = true;

    this.apiAdminService.getServices().subscribe({
      next: (response) => {
        this.services = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to load services.';
        this.isLoading = false;
      }
    });
  }

  get filteredServices(): ServiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.services;
    }

    return this.services.filter(service =>
      service.service_name.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      service.status.toLowerCase().includes(term)
    );
  }

  saveService(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = { ...this.form };

    if (this.editMode && this.editingId !== null) {
      this.apiAdminService.updateService(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Service updated successfully.';
          this.resetForm();
          this.loadServices();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to update service.';
        }
      });
    } else {
      this.apiAdminService.createService(payload).subscribe({
        next: () => {
          this.successMessage = 'Service created successfully.';
          this.resetForm();
          this.loadServices();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Failed to create service.';
        }
      });
    }
  }

  editService(item: ServiceItem): void {
    this.form = {
      serviceName: item.service_name,
      category: item.category,
      description: item.description || '',
      availableDays: item.available_days,
      startTime: item.start_time,
      endTime: item.end_time,
      slotLimit: item.slot_limit,
      status: item.status,
      linkedInventoryItems: item.linked_inventory_items || ''
    };

    this.editMode = true;
    this.editingId = item.id;
  }

  removeService(id: number): void {
    this.apiAdminService.deleteService(id).subscribe({
      next: () => {
        this.successMessage = 'Service deleted successfully.';
        this.loadServices();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to delete service.';
      }
    });
  }

  resetForm(): void {
    this.form = this.createEmptyForm();
    this.editMode = false;
    this.editingId = null;
  }
}