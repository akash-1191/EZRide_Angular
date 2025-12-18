import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';

@Component({
  selector: 'app-driver-payment-details',
  imports: [CommonModule],
  templateUrl: './driver-payment-details.component.html',
  styleUrl: './driver-payment-details.component.css'
})
export class DriverPaymentDetailsComponent implements OnInit {

  payments: any[] = [];
  isLoading = false;
  errorMessage = '';
  isModalOpen = false;
  selectedPayment: any;

  constructor(private service: MyServiceService) { }

  ngOnInit(): void {
    this.loadPaidPayments();
  }

loadPaidPayments() {
  this.isLoading = true;

  this.service.getpaymenttablebydriver().subscribe({
    next: (res: any) => {
     
      this.payments = res?.data ?? [];

      this.isLoading = false;
      console.log('Driver Payments:', this.payments);
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = err.error.message || 'Failed to load paid driver payments';
      this.isLoading = false;
    }
  });
}


  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-IN');
  }

openPaymentModal(item: any) {
  if (!item) return;

  this.selectedPayment = item;
  this.isModalOpen = true;
}

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: any) {
    if (this.isModalOpen) {
      this.isModalOpen = false;
    }
  }
}