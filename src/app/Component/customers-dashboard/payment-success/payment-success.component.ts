import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent {

  bookingDetails: any = {};
  private router = inject(Router);
  //  private location = inject(Location);

  redirectpage() {
    this.router.navigate(['/customer-dashboard']);
  }

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.bookingDetails = nav?.extras?.state?.['bookingDetails'] || {};
  }
  redirecttothepage() {
    this.router.navigate(['customer-dashboard/paymentDetails']);
  }

}

