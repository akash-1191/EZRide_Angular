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
  doc: any = {};
  modalImage: string | null = null;


  isOTPModalOpen = false;
  timerDisplay = '02:00';
  private timerInterval: any;
  private timeLeft = 120;
  email: string = '';
  otp: string = '';
  bookingId: any;
  otpErrorMessage: any;
  otpSentMessage: any;

  isPreFilledEmail: boolean = false;
  isOtpButtonDisabled: boolean = false;
  suseccmsg: any;
  constructor(private services: MyServiceService) { }


  ngOnInit(): void {
    this.loadAllData();
  }

  LoadUserDocument(): void {
    this.services.getCustomerDocument(this.selectedBooking.userId).subscribe({
      next: (res) => {
        // console.log("Document data is the ",res);
        this.doc = res;
      }, error(err) {
        console.log("Somthing Went to wrong");
      },
    })
  }

  loadAllData(): void {
    this.services.getAllDataOftheUser().subscribe({
      next: (res) => {
        const allBookings = res;
        this.bookingdetails = allBookings.filter((booking: any) => booking.bookingStatus === 'Confirmed'); // ✅ filter by status
        this.filteredBookings = [...this.bookingdetails];
        console.log(this.bookingdetails);
      },
      error: (err) => {
        console.log("Something went wrong");
      }
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
    console.log("booking data is:", this.selectedBooking.userId);
    this.LoadUserDocument();
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

  isPdf(path: string): boolean {
    return path?.toLowerCase().endsWith('.pdf');
  }

  openImageModal(path: string) {
    this.modalImage = path;
  }

  closeImageModal() {
    this.modalImage = null;
  }



  OTPopenModal(bookingId: number, existingEmail?: string) {
    this.resetTimer();
    this.bookingId = bookingId;

    if (existingEmail) {
      this.email = existingEmail;
      this.isPreFilledEmail = true;
    } else {
      this.email = '';
      this.isPreFilledEmail = false;
    }

    this.otpSentMessage = '';
    this.otpErrorMessage = '';
    this.isOTPModalOpen = true;
    this.isOTPModalOpen = true;
    this.clearTimer();
    this.suseccmsg = "";
  }

  OTPcloseModal() {
    this.isOTPModalOpen = false;
    this.clearTimer();
    this.isOtpButtonDisabled = false;
  }

  resetTimer() {
    this.timeLeft = 120;
    this.timerDisplay = '02:00';
  }

  startTimer() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
        this.timerDisplay = `${minutes}:${seconds}`;
      } else {
        this.clearTimer();
        this.isOtpButtonDisabled = false; // Re-enable after timer ends
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  sendOtp() {
    if (!this.email || !this.bookingId) {
      console.warn("Email or Booking ID missing");
      return;
    }
    this.isOtpButtonDisabled = true;
    this.services.sendOtp(this.bookingId, this.email).subscribe({
      next: (res) => {
        console.log('OTP Sent:', res);
        this.otpSentMessage = res.message;
        this.otpErrorMessage = '';
        this.resetTimer();
        this.startTimer();
      },
      error: (err) => {
        console.error('Error sending OTP', err);
        this.otpErrorMessage = err.error?.message || 'Failed to send OTP.';
        this.otpSentMessage = '';
        this.isOtpButtonDisabled = false;
      }
    });
  }

  submitOtp() {
    if (!this.otp || !this.bookingId) {
      alert("Please enter OTP and make sure booking is selected!");
      return;
    }

    this.services.verifyOtp(this.bookingId, this.otp).subscribe({
      next: (res) => {
        this.suseccmsg = res.message;
        // alert(res.message || 'OTP verified successfully!');  
        this.clearTimer();
      },
      error: (err) => {
        console.error('OTP verification failed', err);
      }
    });
  }

  ngOnDestroy() {
    this.clearTimer();
  }



}


