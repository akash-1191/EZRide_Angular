import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-booking',
  imports: [CommonModule],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.css'
})
export class MyBookingComponent implements OnInit {

  bookings: any[] = [];
  errorMsg: string = '';
  showModal = false;
  showCancelModal = false;
  selectedBooking: any = null;
  erromessage: any;
  userId!: number;
  showFilterDropdown: boolean = false;
  selectedFilter: string = '';
  filterTypes: string[] = [
    'All',
    'Pending',
    'Confirmed',
    'InProgress',
    'Completed',
    'Cancelled',
    'PaymentSuccess',
    'PaymentPending',
    'PaymentFailed',
    'Latest',
    'Old',
    'PerDay',
    'PerHour',
    'PerKm',
    'Bike',
    'Car'
  ];

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      this.userId = decode.UserId || decode.userId;
      this.loadBookings(this.userId);
      // this.getBookings('latest');
    } else {
      this.errorMsg = 'User not logged in';
    }
  }
  //get all data of the vehhicle table
  loadBookings(userId: number) {
    this.services.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.data || res;
        
      },
      error: (err) => {
        this.errorMsg = 'Failed to load bookings';
      }
    });
  }

  confirmCancelBooking() {
    const booking = this.selectedBooking;
    if (!booking || !booking.bookingId || !this.userId) {
      alert("Invalid booking details.");
      return;
    }


    this.services.cancelBooking(booking.bookingId, this.userId).subscribe({
      next: (res) => {

        this.loadBookings(this.userId); // Refresh list
        this.closeCancelModal();   // Close modal
      },
      error: (err) => {
        this.erromessage = 'Allready Booking Cancel.';
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
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

      case 'All':
      default:

        break;
    }

    this.services.getFilteredBookings(filterPayload).subscribe({
      next: (res) => {
        console.log('Filtered response:', res);
        this.bookings = res?.data || res || [];
      },
      error: (err) => {
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
}
