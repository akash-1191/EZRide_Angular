import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyServiceService } from '../../../../../my-service.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-paymentdetails',
  imports: [CommonModule, FormsModule],
  templateUrl: './paymentdetails.component.html',
  styleUrl: './paymentdetails.component.css'
})
export class PaymentdetailsComponent implements OnInit {

  constructor(private service: MyServiceService) { }

  // Payment data
  payments: any[] = [];
  filteredPayments: any[] = [];
  isLoading: boolean = false;
  error: string = '';
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Summary statistics
  totalAmount: number = 0;
  totalTransactions: number = 0;
  paidCount: number = 0;
  pendingCount: number = 0;
  showMessage: boolean = false;
  backendMessage: string = '';

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.error = '';

    const userId = this.getUserId();

    if (!userId || userId <= 0) {
      this.error = 'User ID not found or invalid. Please login again.';
      this.isLoading = false;
      return;
    }

    this.service.getOwnerPaymentsDetails(userId).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.payments = res;
          this.filteredPayments = [...res];
          this.calculateStatistics();
          console.log('Payments loaded successfully:', this.payments.length, 'records');
        } else {
          this.error = 'Invalid data received from server';
          this.payments = [];
          this.filteredPayments = [];
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading payments:', err);

        // User-friendly error messages
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
        } else if (err.status === 403) {
          this.error = 'You are not authorized to view payments.';
        } else if (err.status === 404) {
          this.error = 'No payment records found.';
        } else if (err.status === 0) {
          this.error = 'Network error. Please check your internet connection.';
        } else {
          this.error = 'Failed to load payment details. Please try again later.';
        }

        this.isLoading = false;
        this.payments = [];
        this.filteredPayments = [];
      },
      complete: () => {
        console.log('Payments API call completed');
      }
    });
  }

  // Get user ID from token - More robust version
  getUserId(): number {
    try {
      // Try sessionStorage first
      let token = sessionStorage.getItem('token');

      // If not in sessionStorage, try localStorage
      if (!token) {
        token = localStorage.getItem('token');
      }

      if (token) {
        // Check if token is valid JWT format
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));

          // Try different possible property names
          const userId = payload.UserId || payload.userId ||
            payload.UserID || payload.userid ||
            payload.sub || payload.id || 0;

          if (userId && userId > 0) {
            return parseInt(userId, 10);
          }
        }
      }

      // Log warning if no token found
      console.warn('No valid token found in storage');
      return 0;

    } catch (e) {
      console.error('Error getting user ID from token:', e);
      return 0;
    }
  }

  // Calculate statistics
  calculateStatistics() {
    this.totalTransactions = this.payments.length;
    this.totalAmount = this.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    this.paidCount = this.payments.filter(p => p.status === 'Paid' || p.status === 'paid').length;
    this.pendingCount = this.payments.filter(p => p.status === 'ReRent' || p.status === 'ReRent').length;
  }

  // Filter payments by status
  filterByStatus() {
    if (this.selectedStatus === 'all') {
      this.filteredPayments = [...this.payments];
    } else {
      this.filteredPayments = this.payments.filter(payment =>
        payment.status?.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    // Apply search filter if any
    this.applySearchFilter();
  }

  // Search payments
  searchPayments() {
    this.applySearchFilter();
  }

  applySearchFilter() {
    if (!this.searchTerm.trim()) {
      // If no search term, just apply status filter
      this.filterByStatus();
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();

    this.filteredPayments = this.payments.filter(payment => {
      // Check multiple fields for search
      return (
        (payment.vehicleName && payment.vehicleName.toLowerCase().includes(term)) ||
        (payment.registrationNo && payment.registrationNo.toLowerCase().includes(term)) ||
        (payment.ownerPaymentId && payment.ownerPaymentId.toString().includes(term)) ||
        (payment.paymentType && payment.paymentType.toLowerCase().includes(term)) ||
        (payment.rentalPeriod && payment.rentalPeriod.toLowerCase().includes(term))
      );
    });
  }

  // Clear search
  clearSearch() {
    this.searchTerm = '';
    this.filteredPayments = [...this.payments];
    this.selectedStatus = 'all';
  }

  // Format date with time
  formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  }

  // Format date only
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  }

  // Format time only
  formatTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Time';
      }
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting time:', dateString, e);
      return 'Invalid Time';
    }
  }


  // Get total amount of filtered payments
  getTotalAmount(): number {
    return this.filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }

  // Get vehicle display name
  getVehicleDisplayName(payment: any): string {
    if (payment.vehicleName) {
      return payment.vehicleName;
    }
    if (payment.registrationNo) {
      return payment.registrationNo;
    }
    return 'Vehicle #' + payment.vehicleId;
  }

  // Refresh data
  refreshData() {
    this.loadPayments();
  }



  // View payment details
  viewPaymentDetails(payment: any) {
    console.log('Viewing payment details:', payment);
    // You can implement a modal or navigate to details page
    const details = `
      Payment ID: ${payment.ownerPaymentId}
      Amount: ${this.formatCurrency(payment.amount)}
      Status: ${payment.status}
      Type: ${payment.paymentType}
      Date: ${this.formatDateTime(payment.createdAt)}
      Vehicle: ${this.getVehicleDisplayName(payment)}
      Registration: ${payment.registrationNo || 'N/A'}
      Rental Period: ${payment.rentalPeriod || 'N/A'}
      Available Days: ${payment.availableDays || 0}
      Rate Per Day: ${this.formatCurrency(payment.vehicleAmountPerDay)}
    `;
    alert(details);
  }

  // Get status badge class
  getStatusClass(status: string): string {
    if (!status) return 'bg-gray-100 text-gray-800';

    const statusLower = status.toLowerCase();
    if (statusLower === 'paid') return 'bg-green-100 text-green-800';
    if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'failed') return 'bg-red-100 text-red-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    if (statusLower === 'refunded') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }

  // Get payment type icon
  getPaymentTypeIcon(paymentType: string): string {
    if (!paymentType) return 'fa-credit-card';

    const typeLower = paymentType.toLowerCase();
    if (typeLower.includes('cash')) return 'fa-money-bill-wave';
    if (typeLower.includes('online')) return 'fa-credit-card';
    if (typeLower.includes('card')) return 'fa-credit-card';
    if (typeLower.includes('bank')) return 'fa-university';
    if (typeLower.includes('upi')) return 'fa-mobile-alt';
    if (typeLower.includes('wallet')) return 'fa-wallet';
    return 'fa-credit-card';
  }


  downloadReceipt(paymentId: number) {
    const payment = this.payments.find(p => p.ownerPaymentId === paymentId);

    if (!payment) {
      alert('Payment not found!');
      return;
    }

    const doc = new jsPDF();

    // ========== HEADER ==========
    let yPos = 20;

    // Company Logo/Name
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('EZRIDE', 105, yPos, { align: 'center' });
    yPos += 8;

    // Tagline
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Vehicle Rental Service', 105, yPos, { align: 'center' });
    yPos += 10;

    // Main Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', 105, yPos, { align: 'center' });
    yPos += 8;

    // Receipt Number
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: #${payment.ownerPaymentId}`, 105, yPos, { align: 'center' });
    yPos += 12;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 15;

    // ========== PAYMENT DETAILS SECTION ==========
    // Section Title
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT DETAILS', 20, yPos);
    yPos += 10;

    // Payment Info Table
    const paymentDetails = [
      ['Transaction ID:', `#${payment.ownerPaymentId}`],
      ['Payment Date:', this.formatDate(payment.createdAt)],
      ['Payment Time:', this.formatTime(payment.createdAt)],
      ['Payment Method:', payment.paymentType || 'Online'],
      ['Transaction Status:', payment.status || 'Paid']
    ];

    paymentDetails.forEach(([label, value]) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(label, 20, yPos);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');

      // Calculate x position for value (right aligned)
      const valueWidth = doc.getTextWidth(value);
      const valueX = 80;
      doc.text(value, valueX, yPos);

      yPos += 7;
    });

    yPos += 8;

    // ========== VEHICLE DETAILS SECTION ==========
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE & RENTAL DETAILS', 20, yPos);
    yPos += 10;

    const vehicleDetails = [
      ['Vehicle Name:', payment.vehicleName || 'N/A'],
      ['Registration No:', payment.registrationNo || 'N/A'],
      ['Vehicle Type:', payment.vehicleType || 'N/A'],
      ['Rental Duration:', `${payment.availableDays || 0} days`],
      ['Daily Rate:', this.formatCurrency(payment.vehicleAmountPerDay || 0)],
      ['Rental Period:', payment.rentalPeriod || 'N/A']
    ];

    vehicleDetails.forEach(([label, value]) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(label, 20, yPos);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 80, yPos);
      yPos += 7;
    });

    yPos += 10;

    // ========== AMOUNT SECTION ==========
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Amount Box
    doc.setDrawColor(41, 128, 185);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(20, yPos, 170, 25, 3, 3, 'FD');

    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 40, yPos + 12);

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const amountText = this.formatCurrency(payment.amount);
    doc.text(amountText, 160, yPos + 14, { align: 'right' });

    // Breakdown (if available)
    if (payment.availableDays && payment.vehicleAmountPerDay) {
      yPos += 18;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      const breakdown = `(${payment.availableDays} days × ${this.formatCurrency(payment.vehicleAmountPerDay)} per day)`;
      doc.text(breakdown, 160, yPos, { align: 'right' });
      yPos += 10;
    } else {
      yPos += 25;
    }

    // ========== FOOTER ==========
    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Company Info
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');

    doc.text('EZRide Vehicle Rental Services', 105, yPos, { align: 'center' });
    yPos += 5;

    doc.text('Contact: +91 9876543210 | Email: support@ezride.com', 105, yPos, { align: 'center' });
    yPos += 5;

    doc.text('Address: 123 Business Street, City, State - 123456', 105, yPos, { align: 'center' });
    yPos += 10;

    // Thank you message
    doc.setFontSize(10);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing EZRide!', 105, yPos, { align: 'center' });
    yPos += 7;

    // Generated info
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })} ${new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })}`, 105, yPos, { align: 'center' });
    yPos += 5;

    doc.text('This is a computer-generated receipt. No signature required.', 105, yPos, { align: 'center' });

    // ========== SAVE PDF ==========
    doc.save(`Receipt-${payment.ownerPaymentId}.pdf`);
  }

  // Fix formatCurrency to avoid spacing issue
  formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₹0';
    }

    // Use proper formatting without extra spaces
    return '₹' + amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  //set re-rent Vehicle
  ReRentVehicle(vehicleId: number) {
    console.log("Re-Rent Vehicle ID:", vehicleId);
    this.service.VehicleReRent(vehicleId).subscribe({
      next: (res: any) => {
        console.log("Backend Response:", res);

        this.showMessage = true;
        this.backendMessage = res.message || res.Message || JSON.stringify(res);

        setTimeout(() => {
          this.showMessage = false;
        }, 3000);

        this.loadPayments();
      },
      error: (err: any) => {
        console.error('Backend Error:', err);
        this.showMessage = true;

        // Extract message from error response
        if (err.error && err.error.message) {
          this.backendMessage = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          this.backendMessage = err.error;
        } else if (err.message) {
          this.backendMessage = err.message;
        } else {
          this.backendMessage = 'An error occurred';
        }

        setTimeout(() => {
          this.showMessage = false;
        }, 5000);
      }
    });
  }

  closeMessage() {
    this.showMessage = false;
  }


}