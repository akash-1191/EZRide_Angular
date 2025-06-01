import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
declare var Razorpay: any;
@Component({
  selector: 'app-payment-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {


  paymentdetails: any[] = [];
  errormessage: any;
  successmessage: any;
  showFilterDropdown: any;
  filteredDetails: any[] = [];
  fshowFilterDropdown: boolean = false;
  selectedFilter: string = 'All';
  filterTypes: string[] = ['All', 'Success', 'Not Paid', 'Pending', 'Failed', 'Latest', 'Oldest'];

  constructor(private services: MyServiceService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPaymentStatusDetails();
  }

  getPaymentStatusDetails(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;

      this.services.paymentStatusDetails(userId).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            this.paymentdetails = res.data;
            // this.filteredDetails = [...this.paymentdetails];


            this.applyFilter('All');
          } else {
            this.errormessage = "No booking payment details found.";
          }
        },
        error: (err) => {

          this.errormessage = "Something went wrong while fetching payment details.";
        }
      });
    }
  }

  // if date and tiem has gone if is a pendog the not show the paynow button 
  isFutureDate(dateString: string): boolean {
    const now = new Date();
    const endTime = new Date(dateString);
    return endTime > now;
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(type: string) {
    this.selectedFilter = type;
    this.showFilterDropdown = false;

    let data = [...this.paymentdetails];

    if (type === 'All') {
      const now = new Date();

      const notPaidFuture = data.filter(item =>
        item.paymentStatus === 'Not Paid' &&
        new Date(item.endTime) > now
      );

      const others = data.filter(item =>
        !(item.paymentStatus === 'Not Paid' && new Date(item.endTime) > now)
      );

      this.filteredDetails = [...notPaidFuture, ...others];
    } else if (['Success', 'Not Paid', 'Pending', 'Failed'].includes(type)) {
      this.filteredDetails = data.filter(item => item.paymentStatus === type);
    } else if (type === 'Latest') {
      this.filteredDetails = data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } else if (type === 'Oldest') {
      this.filteredDetails = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-container')) {
      this.showFilterDropdown = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {

    this.showFilterDropdown = false;
  }

  submitPayment(bookingData: any): void {
    this.services.createOrder({ amount: bookingData.totalAmount }).subscribe({
      next: (res) => {
        const orderId = res.orderId;

        const options: any = {
          key: 'rzp_test_icoOUo8PN7viYp',
          amount: bookingData.securityDepositAmount,
          currency: 'INR',
          name: 'EZRide Payment',
          description: 'Booking Payment',
          image: '../../../../assets/image/LOGO.jpeg',
          order_id: orderId,

          handler: (response: any) => {
            const paymentDetails = {
              bookingId: bookingData.bookingid,
              amount: bookingData.securityDepositAmount,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: 'Success',
              paymentMethod: 'Online',
              createdAt: new Date()
            };

            this.services.verifyAndSavePayment(paymentDetails).subscribe({
              next: (res) => {
                const depositData = {
                  bookingId: bookingData.bookingid,
                  amount: bookingData.securityDepositAmount
                };

                this.services.addSecurityDeposit(depositData).subscribe({
                  next: (res2) => {

                    this.router.navigate(['/customer-dashboard/reciptpage'], {
                      queryParams: { bookingId: bookingData.bookingid }
                    });
                    console.log("hello guy's", bookingData.bookingId);
                  },
                  error: () => {
                    this.errormessage = 'Security deposit save failed';
                  }
                });
              },
              error: () => {
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
          this.errormessage = 'Payment Failed: ' + response.error.description;
        });
      },
      error: () => {
        this.errormessage = 'Failed to create order';
      }
    });
  }
}




