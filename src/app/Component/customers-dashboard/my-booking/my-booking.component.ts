import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-booking',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.css'
})
export class MyBookingComponent implements OnInit {
  currentPage: number = 1;
  bookings: any[] = [];
  errorMsg: string = '';
  successmessage: string = '';
  showModal = false;
  showCancelModal = false;
  selectedBooking: any = null;
  erromessage: any;
  userId!: number;
  showFilterDropdown: boolean = false;
  selectedFilter: string = 'Latest';
  showPaymentMessage = false;
  showEmailPopup = false;
  newEmail = '';
  useOwnEmail = true;
  currentBooking: any = null;
  isSendingEmail = false;
  allBookings: any[] = []; // Yeh store karega ALL bookings with driver details

  filterTypes: string[] = [
    'All', 'Today', 'StartTime_Asc', 'StartTime_Desc', 'Pending', 'Confirmed', 
    'InProgress', 'Completed', 'Cancelled', 'PaymentSuccess', 'PaymentPending', 
    'PaymentFailed', 'Latest', 'Old', 'PerDay', 'PerHour', 'PerKm', 'Bike', 'Car'
  ];

  constructor(private services: MyServiceService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      this.userId = decode.UserId || decode.userId;
      this.loadBookings();
    } else {
      this.errorMsg = 'User not logged in';
    }
  }

  loadBookings() {
    this.services.getAllBookings().subscribe({
      next: (res) => {
        this.allBookings = Array.isArray(res) ? res : [];
        this.bookings = [...this.allBookings]; 

        this.applyFilter(this.selectedFilter);
      },
      error: (err) => {
        console.error("Error loading bookings:", err);
        this.errorMsg = 'Failed to load bookings';
      }
    });
  }

  // Driver details merge function
  mergeDriverDetails(allBookings: any[], filteredBookings: any[]): any[] {
    const driverMap = new Map<number, any>();
    
    allBookings.forEach(b => {
      if (b.bookingId && (b.driverFirstName || b.driverProfileImage)) {
        driverMap.set(b.bookingId, {
          driverFirstName: b.driverFirstName,
          driverLastName: b.driverLastName,
          driverProfileImage: b.driverProfileImage,
          driverExperience: b.driverExperience
        });
      }
    });
    
    // Merge driver details into filtered bookings
    return filteredBookings.map(b => {
      const driverDetails = driverMap.get(b.bookingId);
      return driverDetails ? { ...b, ...driverDetails } : b;
    });
  }

  confirmCancelBooking() {
    const booking = this.selectedBooking;
    if (!booking || !booking.bookingId || !this.userId) {
      this.erromessage = "Invalid booking details.";
      return;
    }
    
    this.services.cancelBooking(booking.bookingId, this.userId).subscribe({
      next: (res) => {
        this.loadBookings();
        this.closeCancelModal();
      },
      error: (err) => {
        this.erromessage = 'Already Booking Cancel.';
      }
    });
  }

  openModal(booking: any) {
    // console.log("Selected Booking Data:", booking);
    this.selectedBooking = booking;
    this.showModal = true;
    this.cdRef.detectChanges();
    
  }

  closeModal() {
    this.showModal = false;
    this.showPaymentMessage = false;
    this.successmessage = '';
    this.erromessage = '';
  }

  openCancelModal(booking: any) {
    this.selectedBooking = booking;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedBooking = null;
    this.erromessage = '';
  }

  // filter ka code 
  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filterType: string) {
    this.selectedFilter = filterType;
    this.getBookings(filterType);
    this.showFilterDropdown = false;
  }

  getBookings(filterType: string) {
    // Agar "All" filter hai, toh direct allBookings use karo
    if (filterType === 'All') {
      this.bookings = [...this.allBookings];
      return;
    }

    const filterPayload: any = {
      userId: this.userId
    };

    switch (filterType) {
      case 'Pending':
      case 'Confirmed':
      case 'InProgress':
      case 'Completed':
      case 'Cancelled':
        filterPayload.bookingStatus = filterType;
        break;
      case 'PaymentSuccess':
        filterPayload.paymentStatus = 'Success';
        break;
      case 'PaymentPending':
        filterPayload.paymentStatus = 'Pending';
        break;
      case 'PaymentFailed':
        filterPayload.paymentStatus = 'Failed';
        break;
      case 'Latest':
        filterPayload.sortBy = 'latest';
        break;
      case 'Old':
        filterPayload.sortBy = 'old';
        break;
      case 'PerDay':
        filterPayload.minDays = 1;
        break;
      case 'PerHour':
        filterPayload.minHours = 1;
        break;
      case 'PerKm':
        filterPayload.minKilometers = 1;
        break;
      case 'Bike':
      case 'Car':
        filterPayload.vehicleType = filterType;
        break;
      case 'Today':
        filterPayload.onlyToday = true;
        break;
      case 'StartTime_Asc':
        filterPayload.sortBy = 'starttime_asc';
        break;
      case 'StartTime_Desc':
        filterPayload.sortBy = 'starttime_desc';
        break;
    }

    this.services.getFilteredBookings(filterPayload).subscribe({
      next: (res) => {
        let filteredBookings = res?.data || res || [];
        
        // Agar allBookings available hain, toh driver details merge karo
        if (this.allBookings && this.allBookings.length > 0 && filteredBookings.length > 0) {
          filteredBookings = this.mergeDriverDetails(this.allBookings, filteredBookings);
        }
        
        this.bookings = filteredBookings;
        console.log(`Filtered bookings (${filterType}):`, this.bookings);
      },
      error: (err) => {
        console.error("Filter error:", err);
        this.errorMsg = 'Failed to load filtered bookings';
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-container')) {
      this.showFilterDropdown = false;
    }
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: any) {
    this.closeCancelModal();
    this.closeModal();
    this.showFilterDropdown = false;
    this.showEmailPopup = false;
  }

  handleDownload(booking: any) {
    if (booking.paymentStatus === 'Success') {
      this.onDownload(booking.bookingId);
      this.showPaymentMessage = false;
    } else {
      this.showPaymentMessage = true;
      this.erromessage = '⚠️ Please complete the payment first using the Payment tab.';
    }
  }

  handleSendEmail(booking: any) {
    if (booking.paymentStatus === 'Success') {
      this.openEmailPopup(booking);
      this.showPaymentMessage = false;
    } else {
      this.showPaymentMessage = true;
      this.erromessage = '⚠️ Please complete the payment first using the Payment tab.';
    }
  }

  openEmailPopup(booking: any) {
    this.currentBooking = booking;
    this.useOwnEmail = true;
    this.newEmail = '';
    this.successmessage = '';
    this.erromessage = '';
    this.showEmailPopup = true;
  }

  sendEmailReceipt() {
    const selectedEmail = this.useOwnEmail
      ? this.currentBooking.useremail
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
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.erromessage = 'No token found in session storage';
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.UserId || decodedToken.userId;
    if (!userId) {
      this.erromessage = 'User ID not found in token';
      return;
    }

    this.services.downloadReceipt(userId, bookingId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PaymentReceipt_User_${userId}_Booking_${bookingId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.successmessage = 'Download Successfully';
      },
      error: (err) => {
        this.erromessage = 'Error downloading receipt: ' + err.message;
      }
    });
  }
}