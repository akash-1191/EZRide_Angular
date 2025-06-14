import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-request',
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './booking-request.component.html',
  styleUrl: './booking-request.component.css'
})
export class BookingRequestComponent implements OnInit {
  booking: any;
  currentPage: number = 1;
  bookingdetails: any[] = [];
  showModal: any;
  selectedBooking: any = null;

  images: string[] = [];
  currentImageIndex: number = 0;
  autoSlideInterval: any;
  showCancelReason: boolean = false;
  cancelReason: string = '';
  errormsg: string = '';
  filteredBookings: any[] = [];
  filterLabel: string = 'All Bookings';
  showFilterDropdown: boolean = false;
  successfullmsg: string = "";

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.services.getAllDataOftheUser().subscribe({
      next: (res) => {
        this.bookingdetails = res;
        this.filteredBookings = [...this.bookingdetails];
        console.log(res);
      }, error(err) {
        console.log("somthig  went to wrong");
      },
    });
  }

  applyDateFilter(type: 'nearest' | 'other'): void {
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime()); // clone date correctly
    twoWeeksLater.setDate(today.getDate() + 14);

    this.showFilterDropdown = false;

    if (type === 'nearest') {
      this.filterLabel = 'Nearest (Next 14 Days)';
      this.filteredBookings = this.bookingdetails
        .filter(booking => {
          const startDate = new Date(booking.startTime);
          return startDate >= today && startDate <= twoWeeksLater;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); // ascending sort
    } else if (type === 'other') {
      this.filterLabel = 'Other Bookings';
      this.filteredBookings = this.bookingdetails
        .filter(booking => {
          const startDate = new Date(booking.startTime);
          return startDate < today || startDate > twoWeeksLater;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); // ascending sort
    }

    this.currentPage = 1;
  }

  resetFilter(): void {
    this.filterLabel = 'All Bookings';
    this.filteredBookings = [...this.bookingdetails];
    this.showFilterDropdown = false;
    this.currentPage = 1;
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
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



  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
      this.showCancelReason = false;
      this.cancelReason = '';
      this.showFilterDropdown = false;
    }
  }


  submitCancelReason() {
    if (!this.cancelReason || this.cancelReason.trim() === '') {
      this.errormsg = 'Please enter a reason before sending.';
      return;
    }

    if (!this.selectedBooking || !this.selectedBooking.bookingId) {
      this.errormsg = 'Booking ID not found.';
      return;
    }
    const bookingId = this.selectedBooking.bookingId;
    console.log("bookingiid is:", bookingId);
    this.services.updateCancelReason(bookingId, this.cancelReason).subscribe({
      next: (res) => {
        this.successfullmsg = 'Booking cancelled successfully.';
        // this.closeModal();
        this.loadAllData();
        this.errormsg = '';
      },
      error: (err) => {
        console.error(err);
        this.errormsg = err.error?.message || 'Something went wrong during cancellation.';
      }
    });
  }


  handOverbutton(bookingId: number): void {
    // console.log(bookingId);
    this.services.setInProgress(bookingId).subscribe({
      next: (res) => {
        this.successfullmsg = res.message;
      }, error: (res) => {
        this.errormsg = res.error?.message || 'An error occurred';
      },
    })
  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.filter-container')) {
      this.showFilterDropdown = false;
    }

  }


}



