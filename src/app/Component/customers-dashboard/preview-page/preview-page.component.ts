import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
declare var Razorpay: any;
@Component({
  selector: 'app-preview-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-page.component.html',
  styleUrl: './preview-page.component.css'
})
export class PreviewPageComponent {

  bookingData: any;
  errormessage: string = '';
  sucsessmessage: string = '';
  // declare var Razorpay: any;

  constructor(private router: Router, private services: MyServiceService) { }

  ngOnInit(): void {
    this.bookingData = history.state.bookingData;

    if (!this.bookingData) {
      
      this.errormessage = 'Booking data missing!';
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decode: any = jwtDecode(token);
        const userId = decode.UserId || decode.userId;
        this.bookingData.userId = userId;
      } catch (e) {
       
        this.errormessage = 'Invalid session token';
      }
    } else {
   
      this.errormessage = 'User not logged in';
    }
  }

  confirmBooking(): void {
    if (!this.bookingData || !this.bookingData.userId) {
      this.errormessage = 'Cannot proceed without valid booking data or user ID';
      return;
    }

    const payload = {
      userId: this.bookingData.userId,
      vehicleId: this.bookingData.vehicleDetails?.vehicleId,
      startTime: new Date(
        this.bookingData.bookingFormValues.pickupDate + 'T' + this.bookingData.bookingFormValues.pickupTime
      ),
      endTime: new Date(
        this.bookingData.bookingFormValues.dropoffDate + 'T' + this.bookingData.bookingFormValues.dropoffTime
      ),
      totalDistance: 0,
      totalAmount: this.bookingData.totalAmount,
      bookingType: this.bookingData.bookingFormValues.driveBasis,
      totalDays: this.bookingData.bookingFormValues.driveBasis === 'perDay' ? this.bookingData.bookingFormValues.daysToDrive : null,
      totalHours: this.bookingData.bookingFormValues.driveBasis === 'perHour' ? this.bookingData.bookingFormValues.hoursToDrive : null,
      perKelomeater: this.bookingData.bookingFormValues.driveBasis === 'perKm' ? this.bookingData.bookingFormValues.kmsToDrive : null,
      status: 'Pending',
      createdAt: new Date()
    };

    this.services.confirmBooking(payload).subscribe({
      next: (res: any) => {
       
        this.bookingData.bookingId = res.data.bookingId;
        this.submitPayment();

      },
      error: (err: any) => {
        // console.error(' Error while confirming booking:', err);
        if (err.error && err.error.message) {
          this.errormessage = err.error.message;
        } else {
          this.errormessage = 'Failed to confirm booking. Please try again.';
        }
      }
    });
  }

  submitPayment(): void {
    this.services.createOrder({ amount: this.bookingData.totalAmount }).subscribe({
      next: (res) => {
        const orderId = res.orderId;
        const options: any = {
          key: 'rzp_test_icoOUo8PN7viYp', // Razorpay test key
          amount: this.bookingData.totalAmount * 100,
          currency: 'INR',
          name: 'EZRide Payment',
          description: 'Booking Payment',
          image: '../../../../assets/image/LOGO.jpeg',
          order_id: orderId,

          handler: (response: any) => {
            // console.log(' Razorpay Response:', response);
            // console.log(' Booking ID being sent for payment:', this.bookingData.bookingId);

            const paymentDetails = {
              bookingId: this.bookingData.bookingId,
              amount: this.bookingData.totalAmount,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: 'Success',
              paymentMethod: 'Online',
              createdAt: new Date()
            };

            this.services.verifyAndSavePayment(paymentDetails).subscribe({
              next: (res) => {
                // this.sucsessmessage = 'Payment Verified & Saved';
                // this.router.navigate(['/paymentsuccess']);
                // console.log(this.bookingData);
                this.router.navigate(['/customer-dashboard/paymentsuccess'], {
                  state: { bookingDetails: this.bookingData }
                });

              },
              error: (err) => {
                // console.error(err);
                this.errormessage = 'Payment verification failed';
              }
            });
          },

          prefill: {
            name: 'Akash',
            email: 'ezride123@gmail.com',
            contact: '6355923492'
          },
          theme: {
            color: '#528FF0'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', (response: any) => {
          // console.log('Payment Failed:', response.error);
          this.errormessage = ' Payment Failed: ' + response.error.description;
        });
      },

      error: (err) => {
        // console.error('Order creation failed', err);
        this.errormessage = 'Failed to create order';
      }
    });
  }
}
