import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ServiceStatus = 'Active' | 'Inactive';

interface ServiceScheduleItem {
  id: number;
  serviceName: string;
  category: string;
  description: string;
  availableDays: string;
  startTime: string;
  endTime: string;
  slotLimit: number;
  status: ServiceStatus;
  linkedInventoryItems: string;
}

@Component({
  selector: 'app-admin-service-schedule-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-service-schedule-page.html',
  styleUrl: './admin-service-schedule-page.css'
})
export class AdminServiceSchedulePage {
  services: ServiceScheduleItem[] = [
    {
      id: 1,
      serviceName: 'Vaccination',
      category: 'vaccination',
      description: 'Routine and seasonal vaccines',
      availableDays: 'Mon, Wed, Fri',
      startTime: '08:00',
      endTime: '12:00',
      slotLimit: 25,
      status: 'Active',
      linkedInventoryItems: 'Syringe, Vaccine Vials, Cotton'
    },
    {
      id: 2,
      serviceName: 'Dental Care',
      category: 'dental care',
      description: 'Basic oral consultation and treatment',
      availableDays: 'Tue, Thu',
      startTime: '09:00',
      endTime: '15:00',
      slotLimit: 12,
      status: 'Active',
      linkedInventoryItems: 'Gloves, Gauze, Dental Kits'
    },
    {
      id: 3,
      serviceName: 'Laboratory Tests',
      category: 'laboratory tests',
      description: 'Urinary and blood related diagnostic tests',
      availableDays: 'Mon to Sat',
      startTime: '07:30',
      endTime: '11:30',
      slotLimit: 30,
      status: 'Inactive',
      linkedInventoryItems: 'Test Tubes, Syringe, Alcohol'
    }
  ];

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

  form: ServiceScheduleItem = this.createEmptyForm();

  editMode = false;
  editingId: number | null = null;
  searchTerm = '';

  createEmptyForm(): ServiceScheduleItem {
    return {
      id: 0,
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

  get filteredServices(): ServiceScheduleItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.services;
    }

    return this.services.filter(service =>
      service.serviceName.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      service.status.toLowerCase().includes(term)
    );
  }

  saveService(): void {
    if (
      !this.form.serviceName ||
      !this.form.category ||
      !this.form.availableDays ||
      !this.form.startTime ||
      !this.form.endTime ||
      !this.form.slotLimit
    ) {
      return;
    }

    if (this.editMode && this.editingId !== null) {
      this.services = this.services.map(service =>
        service.id === this.editingId ? { ...this.form, id: this.editingId } : service
      );
    } else {
      const newItem: ServiceScheduleItem = {
        ...this.form,
        id: Date.now()
      };
      this.services.unshift(newItem);
    }

    this.resetForm();
  }

  editService(item: ServiceScheduleItem): void {
    this.form = { ...item };
    this.editMode = true;
    this.editingId = item.id;
  }

  removeService(id: number): void {
    this.services = this.services.filter(service => service.id !== id);

    if (this.editingId === id) {
      this.resetForm();
    }
  }

  toggleStatus(item: ServiceScheduleItem): void {
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
  }

  resetForm(): void {
    this.form = this.createEmptyForm();
    this.editMode = false;
    this.editingId = null;
  }

  getStatusClass(status: ServiceStatus): string {
    return status === 'Active' ? 'status active' : 'status inactive';
  }
}