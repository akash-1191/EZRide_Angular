import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-driverbookig-data',
  imports: [FormsModule,CommonModule],
  templateUrl: './driverbookig-data.component.html',
  styleUrl: './driverbookig-data.component.css'
})
export class DriverbookigDataComponent  implements OnInit {
   driverId!: number;
  bookingData: any[] = [];
  filteredBookings: any[] = [];
  isLoading: boolean = false;
  successMessage = '';
  errorMessage = '';

  showAmountModal = false;
selectedAmount: number=0;

  
  // Status filter
  selectedStatus: string = 'all';
  
  // Modal properties
  showContactModal: boolean = false;
  selectedContact: any = null;

  constructor(
    private route: ActivatedRoute,
    private services: MyServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.driverId = Number(params.get('id'));
      if (this.driverId) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.services.AdminGetAallDriverdetailsbyid(this.driverId).subscribe({
      next: (res) => {
        this.bookingData = res.data || [];
        this.filteredBookings = [...this.bookingData];
        this.successMessage = `Loaded ${this.bookingData.length} bookings successfully`;
        this.isLoading = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Boking not Found this driver';
        this.isLoading = false;
      }
    });
  }


  openAmountModal(booking: any) {
  this.selectedAmount = booking.driver.perDayRate;
  this.showAmountModal = true;
}

closeModal() {
  this.showAmountModal = false;
}

updateAmount() {
    // Update the perDayRate in booking object
    console.log('Updated amount:', this.selectedAmount);
    // Assuming you want to update the backend, call the API here.
    this.services.updatePerDayRate(this.driverId, this.selectedAmount).subscribe({
        next: (response) => {
            console.log('Rate updated successfully:', response);
            this.closeModal();
            this.loadData();
        },
        error: (error) => {
            console.error('Error updating rate:', error);
        }
    });
    this.closeModal();
}


  // Get count for each status
  getStatusCount(status: string): number {
    return this.bookingData.filter(booking => booking.booking.status === status).length;
  }

  // Filter by status
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    
    if (status === 'all') {
      this.filteredBookings = [...this.bookingData];
    } else {
      this.filteredBookings = this.bookingData.filter(booking => 
        booking.booking.status === status
      );
    }
  }
  // Reset filters
  resetFilters(): void {
    this.selectedStatus = 'all';
    this.filteredBookings = [...this.bookingData];
  }

  // CSS Class Methods for cards
  getStatusClass(status: string): any {
    return {
      'bg-blue-100 text-blue-700': status === 'Assigned',
      'bg-yellow-100 text-yellow-700': status === 'InProgress',
      'bg-green-100 text-green-700': status === 'Completed',
      'bg-red-100 text-red-700': status === 'Cancelled',
      'bg-gray-100 text-gray-700': !status
    };
  }

  getStatusBgClass(status: string): string {
    switch(status) {
      case 'Assigned': return 'bg-blue-50';
      case 'InProgress': return 'bg-yellow-50';
      case 'Completed': return 'bg-green-50';
      case 'Cancelled': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  }

  getVehicleTypeClass(vehicleType: string): any {
    return {
      'bg-green-100 text-green-700': vehicleType === 'Bike',
      'bg-blue-100 text-blue-700': vehicleType === 'Car',
      'bg-gray-100 text-gray-800': !vehicleType
    };
  }

  // Date Formatting Methods
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }

  formatDateOnly(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return 'N/A';
    }
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'N/A';
    }
  }

  getDuration(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;
      
      if (diffDays > 0) {
        return `${diffDays}d ${remainingHours}h`;
      } else {
        return `${diffHours}h`;
      }
    } catch {
      return 'N/A';
    }
  }

  // Modal Methods
  openContactModal(booking: any): void {
    this.selectedContact = booking;
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.selectedContact = null;
  }

  sendQuickMessage(): void {
    if (this.selectedContact) {
      const driverMsg = `Hi ${this.selectedContact.driver.driverFullName}, regarding booking #${this.filteredBookings.indexOf(this.selectedContact) + 1}`;
      const customerMsg = `Hi ${this.selectedContact.customer.customerFullName}, regarding your booking #${this.filteredBookings.indexOf(this.selectedContact) + 1}`;
      
      alert('Quick message prepared. In real app, this would send via SMS/Email.');
      this.closeContactModal();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
handleEscapeKey(event: any) {
  this.closeContactModal();
  this.closeModal();
}


calculateTotalAmount(booking: any): number {
  const perDayRate = booking.driver.perDayRate;
  const start = new Date(booking.booking.startTime);
  const end = new Date(booking.booking.endTime);

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return perDayRate * totalDays;
}


makePayment(booking: any) {
   const perDayRate = booking.driver.perDayRate; 
  const driverId = booking.driver.driverId;
  const bookingId = booking.booking.bookingId;

  const startDate = new Date(booking.booking.startTime);  
  const endDate = new Date(booking.booking.endTime);  
  const diffTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 3600 * 24));  
  const totalAmount = perDayRate * totalDays;
  console.log("makepment data is", booking.booking.bookingId);
  // Call service to create Razorpay order
  this.services.createDriverPaymentOrder(totalAmount).subscribe({
    next: (res) => {
      const orderId = res.orderId;

      // Razorpay modal options
      const options = {
        key: environment.SECRET_KEY_Razorpay,  // Your Razorpay Key
        amount: totalAmount * 100,  // Amount in paise
        currency: 'INR',
        name: 'EZRide',
        description: 'Driver Payment',
        order_id: orderId,

        handler: (response: any) => {
          const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            driverId: driverId,
            bookingId: bookingId,
            amount: totalAmount
          };
  console.log("makepment verify", paymentData);

          // Verify the payment and save it
          this.services.verifyDriverPayment(paymentData).subscribe({
            next: (verifyResponse) => {
              console.log('Payment verified successfully:', verifyResponse);
              this.loadData();  // Refresh data to show payment status
            },
            error: (err) => {
              console.error('Payment verification failed', err);
              alert('Payment verification failed!');
            }
          });
        },

        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
            this.loadData();  // Reload data if the modal is closed
          }
        },

        theme: {
          color: '#10B981'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();  // Open Razorpay modal
    },
    error: (err) => {
      console.error('Failed to create Razorpay order', err);
      alert('Failed to create payment order!');
    }
  });
}

}