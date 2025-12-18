import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driverpaymentdrtails',
  imports: [CommonModule],
  templateUrl: './driverpaymentdrtails.component.html',
  styleUrl: './driverpaymentdrtails.component.css'
})
export class DriverpaymentdrtailsComponent implements OnInit {

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
    this.service.getpaymenttabledriver().subscribe({
      next: (res) => {
        this.payments = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load paid driver payments';
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-IN');
  }

  openPaymentModal(item: any) {
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