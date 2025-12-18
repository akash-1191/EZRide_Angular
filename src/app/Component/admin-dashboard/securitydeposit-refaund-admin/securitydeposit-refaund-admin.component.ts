import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../.../../../../environments/environment'


@Component({
  selector: 'app-securitydeposit-refaund-admin',
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './securitydeposit-refaund-admin.component.html',
  styleUrl: './securitydeposit-refaund-admin.component.css'
})

export class SecuritydepositRefaundAdminComponent implements OnInit {
  booking: any;
  currentPage: number = 1;
  bookingdetails: any[] = [];
  showModal: any;
  selectedBooking: any = null;
  successmessage: any;
  images: string[] = [];
  currentImageIndex: number = 0;
  autoSlideInterval: any;
  showCancelReason: boolean = false;
  cancelReason: string = '';
  errormsg: string = '';
  showFilterDropdown: boolean = false;
  successfullmsg: string = "";
  damageSuccessMessage: string = '';
  isFuelModalOpen: boolean = false;
  bookingId: any;


  constructor(private services: MyServiceService) { }


  ngOnInit(): void {
    this.loadAllData();
  }



  loadAllData(): void {
    this.services.getAllSecurityrefaund().subscribe({
      next: (res: any[]) => {
        this.bookingdetails = res;

        if (res.length > 0) {
          this.bookingId = res[0].bookingId;
        } else {
          this.bookingId = null;
        }
        console.log("All booking data:", this.bookingdetails);
        // console.log("booking id is:", this.bookingId);
      },
      error: (err) => {
        console.log("Something went wrong", err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.showCancelReason = false;
    this.cancelReason = '';
  }

  openModal(booking: any): void {
    this.selectedBooking = booking;
    this.showModal = true;
    this.images = booking.vehicleImages || [];
    this.currentImageIndex = 0;
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    this.clearAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  clearAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }




  openRazorpay(amount: number, bookingId: any) {

    this.services.createSecurityDepositOrder(amount).subscribe((data) => {
      const options = {
        key: environment.SECRET_KEY_Razorpay,
        amount: data.amount,
        currency: "INR",
        name: 'EZRide - Security Deposit',
        description: 'Refundable Security Deposit',
        order_id: data.orderId,
        // handler: (response: any) => {
        //   console.log('Payment successful', response);
        //   // Send this response to server to verify and save
        //   this.refundDeposit(bookingId);
        // }
        handler: (response: any) => {
          console.log('Payment successful', response);

          this.services.saveSecurityDeposit({
            bookingId: bookingId,
            amount: amount
          }).subscribe({
            next: () => {
              console.log('Security deposit saved');
               this.refundDeposit(bookingId);
            },
            error: (err) => {
              console.error('Failed to save deposit', err);
            }
          });
        },
        prefill: {
          name: 'Akash',
          email: 'ezride123@gmail.com',
          contact: '+91 6355923492'
        },
        theme: {
          color: '#F37254'
        }
      };

      console.log('Razorpay order data:', options);
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }


  refundDeposit(bookingId: number) {
    console.log("booking dta is the inside", bookingId);
    this.services.refundSecurityDeposit(bookingId).subscribe({
      next: (res) => {
        console.log('Refund Successful ');
        console.log(res);
      },
      error: (err) => {
        console.error('Error refunding deposit :', err);

      }
    });

  }
}

