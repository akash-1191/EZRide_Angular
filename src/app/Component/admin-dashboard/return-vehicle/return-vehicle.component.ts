import { Component, HostListener } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-vehicle',
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './return-vehicle.component.html',
  styleUrl: './return-vehicle.component.css'
})
export class ReturnVehicleComponent {
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
  filteredBookings: any[] = [];
  filterLabel: string = 'All Bookings';
  showFilterDropdown: boolean = false;
  successfullmsg: string = "";
  damageSuccessMessage: string = '';
  isFuelModalOpen: boolean = false;
  bookingId: any;

  perLiterAmount = 95.5;

 fuelLog = {
    bookingId: 0,
    fuelGiven: null as number | null,
    fuelReturned: null as number | null,
    fuelCharge: null as number | null
  };


  damageReport = {
    bookingId: 0,
    description: '',
    repairCost: null,
    image: ''
  };


  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadAllData();
  }


  loadAllData(): void {
    this.services.getAllDataOftheUser().subscribe({
      next: (res) => {
        const allBookings = res;
        this.bookingdetails = allBookings.filter((booking: any) => booking.bookingStatus === 'InProgress');
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



  openFuelModal(bookingId: number) {
    this.isFuelModalOpen = true;
    this.bookingId = bookingId;
  }

  closeFuelModal() {
    this.isFuelModalOpen = false;
  }
  calculateFuelCharge() {
    const given = this.fuelLog.fuelGiven || 0;
    const returned = this.fuelLog.fuelReturned || 0;

    const usedFuel = given - returned;
    if (usedFuel >= 0) {
      this.fuelLog.fuelCharge = parseFloat((usedFuel * this.perLiterAmount).toFixed(2));
    } else {
      this.fuelLog.fuelCharge = 0;
    }
  }


  submitFuelLog() {
    this.fuelLog.bookingId = this.bookingId;  // <- ye line zaroori hai
    this.services.createFuelLog(this.fuelLog).subscribe({
      next: (res) => {
        this.successmessage = "Fuel log submitted successfully ";
        this.fuelLog.fuelGiven = null;
        this.fuelLog.fuelReturned = null;
        this.fuelLog.fuelCharge = null;
      },
      error: (err) => {
        console.error(err);
      }
    });

  }


  submitDamageReport() {
    this.damageReport.bookingId = this.bookingId;

    if (!this.damageReport.image) {
      alert("Please upload an image before submitting.");
      return;
    }

    this.services.createdamagedetails(this.damageReport).subscribe({
      next: (res) => {
        this.damageSuccessMessage = 'Damage report submitted successfully';
        this.damageReport = {
          bookingId: this.bookingId,
          description: '',
          repairCost: null,
          image: ''
        };
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong');
      }
    });
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // reader.result will be a base64 string with content-type
        this.damageReport.image = reader.result as string;
        console.log("Image base64 ready:", this.damageReport.image.substring(0, 50));
      };

      reader.readAsDataURL(file); // convert to base64
    }
  }


  completevehicle() {
    this.services.setBookingToCompleted(this.bookingId).subscribe({
      next: (res) => {
        console.log(res.message || 'Booking marked as completed!');
        this.closeFuelModal();
        this.loadAllData();
      },
      error: (err) => {
        alert('Failed to update status');
        console.error(err);
      }
    });
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.filter-container')) {
      this.showFilterDropdown = false;
    }

  }

}
