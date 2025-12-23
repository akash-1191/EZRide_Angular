import { Component } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fuel-damage-report',
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './fuel-damage-report.component.html',
  styleUrl: './fuel-damage-report.component.css'
})
export class FuelDamageReportComponent {
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

baseUrl: string = 'https://aspcoreezride.onrender.com/';
  constructor(private services: MyServiceService) { }


  ngOnInit(): void {
    this.loadAllData();
  }


  loadAllData(): void {
    this.services.getAlldamagecharges().subscribe({
      next: (res) => {
        const allBookings = res;
        this.bookingdetails = allBookings;
        this.bookingId = res.bookingId;
        console.log(this.bookingdetails);
        console.log("bookig id is:", this.bookingId);

      },
      error: (err) => {
        console.log("Something went wrong");
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

}
