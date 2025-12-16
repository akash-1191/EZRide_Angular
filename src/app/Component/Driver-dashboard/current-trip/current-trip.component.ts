import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-trip',
  imports: [FormsModule,CommonModule],
  templateUrl: './current-trip.component.html',
  styleUrl: './current-trip.component.css'
})
export class CurrentTripComponent implements OnInit {

  trips: any[] = [];
  filteredTrips: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Search and filter properties
  searchTerm: string = '';
  selectedVehicleType: string = 'all';
  selectedStatus: string = 'all';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  driverbookingidis:number=0;

  constructor(private services: MyServiceService) {}

  ngOnInit(): void {
    this.loadDriverTrips();
  }

  loadDriverTrips(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.services.driverGetAallbooking().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          this.trips = response.data;
          this.filteredTrips = [...this.trips];
          this.calculateTotalPages();
          this.successMessage = `Loaded ${this.trips.length} trips successfully`;
          
          // Auto hide success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.errorMessage = 'No data found or invalid response format';
          this.trips = [];
          this.filteredTrips = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading driver trips:', error);
        this.errorMessage = 'Failed to load driver trips. Please try again.';
        this.isLoading = false;
        this.trips = [];
        this.filteredTrips = [];
      }
    });
  }

  // Get bike trips count
  getBikeTripsCount(): number {
    return this.trips.filter(t => t.vehicleType === 'Bike').length;
  }

  // Get car trips count
  getCarTripsCount(): number {
    return this.trips.filter(t => t.vehicleType === 'Car').length;
  }

  // Get vehicle type CSS class
  getVehicleTypeClass(vehicleType: string): any {
    return {
      'bg-green-100 text-green-800': vehicleType === 'Bike',
      'bg-purple-100 text-purple-800': vehicleType === 'Car',
      'bg-gray-100 text-gray-800': !vehicleType
    };
  }

  // Get status CSS class
  getStatusClass(status: string): any {
    return {
      'bg-green-100 text-green-800': status === 'Assigned',
      'bg-yellow-100 text-yellow-800': status === 'InProgress',
      'bg-gray-100 text-gray-800': status === 'Completed' || !status
    };
  }

  // Filter trips based on search and filters
  applyFilters(): void {
    let filtered = [...this.trips];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(trip => 
        (trip.driverFullName && trip.driverFullName.toLowerCase().includes(term)) ||
        (trip.driverPhone && trip.driverPhone.includes(term)) ||
        (trip.customerFullName && trip.customerFullName.toLowerCase().includes(term)) ||
        (trip.customerPhone && trip.customerPhone.includes(term)) ||
        (trip.registrationNo && trip.registrationNo.toLowerCase().includes(term)) ||
        (trip.customerCity && trip.customerCity.toLowerCase().includes(term)) ||
         this.doesDateMatch(trip.startTime, term) ||
      this.doesDateMatch(trip.endTime, term)
      );
    }

    // Vehicle type filter
    if (this.selectedVehicleType !== 'all') {
      filtered = filtered.filter(trip => 
        trip.vehicleType === this.selectedVehicleType
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(trip => 
        trip.status === this.selectedStatus
      );
    }

    this.filteredTrips = filtered;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  // Check if date matches search term
doesDateMatch(dateString: string, searchTerm: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    
    // Multiple formats me search karo
    const dateFormats = [
      date.toISOString().split('T')[0], // YYYY-MM-DD
      date.toLocaleDateString('en-IN'), // DD/MM/YYYY
      date.toLocaleDateString('en-US'), // MM/DD/YYYY
      date.getFullYear().toString(),    // Year only
      (date.getMonth() + 1).toString(), // Month only
      date.getDate().toString(),        // Day only
      date.toLocaleString('en-IN', {    // Formatted date
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toLowerCase()
    ];
    
    // Check karo koi bhi format match karta hai ya nahi
    return dateFormats.some(format => 
      format.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    return false;
  }
}

  // Calculate total pages for pagination
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredTrips.length / this.itemsPerPage);
    if (this.totalPages < 1) {
      this.totalPages = 1;
    }
  }

  // Get trips for current page
  getPaginatedTrips(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTrips.slice(startIndex, endIndex);
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Get page numbers array
  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Reset filters
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedVehicleType = 'all';
    this.selectedStatus = 'all';
    this.currentPage = 1;
    this.filteredTrips = [...this.trips];
    this.calculateTotalPages();
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'N/A';
    }
  }


  updateStatusCompleted(driverBookingId: number): void {
  console.log('Driver Booking ID:', driverBookingId);
  this.driverbookingidis=driverBookingId; 
     this.services.driverUpdateStatuscompleted(this.driverbookingidis).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.loadDriverTrips();
      },
      error: (err) => {
        console.log("errormessage",err);
        this.errorMessage = 'Failed to update driver availability.';
        this.successMessage = '';
      }
    });
  }
  

  // Refresh data
  refreshData(): void {
    this.loadDriverTrips();
    this.resetFilters();
  }
}
