import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-service-schedule-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-service-schedule-page.html',
  styleUrl: './admin-service-schedule-page.css'
})
export class AdminServiceSchedulePage {
  services = [
    {
      name: 'Vaccination',
      category: 'vaccination',
      description: 'Routine and seasonal vaccination services',
      days: 'Mon, Wed, Fri',
      time: '8:00 AM - 12:00 PM',
      slots: 25,
      status: 'Active'
    },
    {
      name: 'Dental Care',
      category: 'dental care',
      description: 'Basic dental consultation and oral care',
      days: 'Tuesday, Thursday',
      time: '1:00 PM - 4:00 PM',
      slots: 12,
      status: 'Active'
    }
  ];

  form = {
    name: '',
    category: 'general check up',
    description: '',
    days: '',
    startTime: '',
    endTime: '',
    slots: 0
  };

  addService(): void {
    if (!this.form.name || !this.form.days || !this.form.startTime || !this.form.endTime || !this.form.slots) {
      return;
    }

    this.services.unshift({
      name: this.form.name,
      category: this.form.category,
      description: this.form.description,
      days: this.form.days,
      time: `${this.form.startTime} - ${this.form.endTime}`,
      slots: this.form.slots,
      status: 'Active'
    });

    this.form = {
      name: '',
      category: 'general check up',
      description: '',
      days: '',
      startTime: '',
      endTime: '',
      slots: 0
    };
  }

  toggleStatus(item: { status: string }): void {
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
  }
}