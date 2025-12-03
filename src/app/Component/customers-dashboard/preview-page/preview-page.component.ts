import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import {environment } from '../../.../../../../environments/environment'

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

    const pickupDate: Date = new Date(this.bookingData.bookingFormValues.pickupDate);
    const { hour: pickupHour, minute: pickupMinute } = this.parseTime(this.bookingData.bookingFormValues.pickupTime);
    pickupDate.setHours(pickupHour, pickupMinute, 0, 0);

    const dropoffDate: Date = new Date(this.bookingData.bookingFormValues.dropoffDate);
    const { hour: dropoffHour, minute: dropoffMinute } = this.parseTime(this.bookingData.bookingFormValues.dropoffTime);
    dropoffDate.setHours(dropoffHour, dropoffMinute, 0, 0);

    const payload = {
      userId: this.bookingData.userId,
      vehicleId: this.bookingData.vehicleDetails?.vehicleId,
      startTime: pickupDate.toISOString(),   //  ISO format string
      endTime: dropoffDate.toISOString(),
      totalDistance: 0,
      totalAmount: this.bookingData.totalAmount,
      bookingType: this.bookingData.bookingFormValues.driveBasis,
      securityAmount: this.bookingData.bookingFormValues.securityDepositAmount,
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
        console.log("conferm booking data is the :",res)
      },
      error: (err: any) => {
        console.log("errormsg:",err); 
        if (err.error && err.error.message) {
          this.errormessage = err.error.message;
        } else {
          this.errormessage = 'Failed to confirm booking. Please try again.';
        }
      }
    });
  }


  parseTime(timeStr: string): { hour: number, minute: number } {
    const isAmPmFormat = /am|pm/i.test(timeStr);
    let hour = 0, minute = 0;

    if (isAmPmFormat) {
      const [time, modifier] = timeStr.toLowerCase().split(/(am|pm)/i);
      const [h, m] = time.trim().split(':').map(Number);

      hour = h;
      minute = m;

      if (modifier === 'pm' && hour < 12) hour += 12;
      if (modifier === 'am' && hour === 12) hour = 0;
    } else {
      const [h, m] = timeStr.split(':').map(Number);
      hour = h;
      minute = m;
    }

    return { hour, minute };
  }

  submitPayment(): void {
    this.services.createOrder({ amount: this.bookingData.totalAmount }).subscribe({
      next: (res) => {
        
        console.log('Order Response:', res);
        console.log('Amount Type:', typeof res.amount, 'Currency:', res.currency);
        const orderId = res.orderId;
        const options: any = {
          key: environment.SECRET_KEY_Razorpay, // Razorpay test key
          amount: Number(res.amount),
          currency: 'INR',
          name: 'EZRide Payment',
          description: 'Booking Payment',
          image: '../../../../assets/image/LOGO.jpeg',
          order_id: orderId,

          handler: (response: any) => {

            const paymentDetails = {
              bookingId: this.bookingData.bookingId,
              amount: this.bookingData.totalAmount,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature?.toLowerCase(),
              status: 'Success',
              paymentMethod: 'Online',
              createdAt: new Date()
            };

            this.services.verifyAndSavePayment(paymentDetails).subscribe({
              next: (res) => {
                const depositData = {
                  bookingId: this.bookingData.bookingId,
                  amount: this.bookingData.vehicleDetails.securityDepositAmount
                };
                console.log(' next Razorpay order response:', res);
                // console.log(this.bookingData);
                this.services.addSecurityDeposit(depositData).subscribe({
                  next: (res2) => {
                    this.router.navigate(['/customer-dashboard/reciptpage'], {
                     queryParams: { bookingId: this.bookingData.bookingId }
                    });
                  

                  },
                  error: (err2) => {
                    this.errormessage = 'Security deposit save failed',err2;
                  }
                });
              },
              error: (err) => {
                this.errormessage = 'Payment verification failed',err;
              }
            });
          },

          prefill: {
            name: 'Akash',
            email: 'ezride123@gmail.com',
            contact: '+91 6355923492'
          },
          theme: {
            color: '#528FF0'
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', (response: any) => {
          this.errormessage = ' Payment Failed: ' + response.error.description;
        });
      },

      error: (err) => {
        // console.error('Order creation failed', err);
        this.errormessage = 'Failed to create order',err;
      }
    });
  }
}
