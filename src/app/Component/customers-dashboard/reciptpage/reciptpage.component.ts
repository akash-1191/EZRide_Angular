import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reciptpage',
  imports: [CommonModule, FormsModule],
  templateUrl: './reciptpage.component.html',
  styleUrl: './reciptpage.component.css'
})
export class ReciptpageComponent implements OnInit {

  constructor(private services: MyServiceService,private route: ActivatedRoute) { }

 
  erromessage: string = '';
  successmessage: string = '';
  showEmailPopup: boolean = false;
  isSendingEmail: boolean = false;
  useOwnEmail: boolean = false;
  newEmail: string = '';
  currentBooking: any = null;
  userId: any;

  ngOnInit(): void {
  const token = sessionStorage.getItem('token');
  if (token) {
    const decodedToken: any = jwtDecode(token);
    this.userId = decodedToken.UserId || decodedToken.userId;
  }

  this.route.queryParams.subscribe(params => {
    const bookingId = params['bookingId'];
    if (bookingId) {
      // Fetch or bind this booking
      this.currentBooking = {
        bookingId: bookingId,
        useremail: '' // will be entered by user
      };
    }
  });
}

  handleDownload(booking: any) {
    this.clearMessages();
    this.onDownload(booking.bookingId);
  }

  handleSendEmail(booking: any) {
    this.clearMessages();
    this.openEmailPopup(booking);
  }

  openEmailPopup(booking: any) {
    this.currentBooking = booking;
    this.newEmail = '';
    this.useOwnEmail = false;
    this.successmessage = '';
    this.erromessage = '';
    this.showEmailPopup = true;
  }

  sendEmailReceipt() {
    const selectedEmail = this.useOwnEmail
      ? this.currentBooking?.useremail
      : this.newEmail.trim();

    if (!selectedEmail) {
      this.erromessage = 'Please provide a valid email address.';
      return;
    }

    this.isSendingEmail = true;

    this.services.sendReceiptEmail(this.userId, this.currentBooking.bookingId, selectedEmail).subscribe({
      next: () => {
        this.successmessage = 'Receipt email sent successfully!';
        this.erromessage = '';
        this.showEmailPopup = false;
        this.isSendingEmail = false;
      },
      error: (err) => {
        console.error(err);
        this.successmessage = '';
        this.erromessage = 'Failed to send receipt email.';
        this.isSendingEmail = false;
      }
    });
  }

  onDownload(bookingId: number) {
    if (!this.userId) {
      this.erromessage = 'User ID not found';
      return;
    }

    this.services.downloadReceipt(this.userId, bookingId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PaymentReceipt_User_${this.userId}_Booking_${bookingId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.successmessage = 'Download Successfully';
      },
      error: (err) => {
        this.erromessage = 'Error downloading receipt: ' + err.message;
      }
    });
  }

  clearMessages() {
    this.erromessage = '';
    this.successmessage = '';
  }
}
