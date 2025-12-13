import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../.../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-owner-payment',
  imports: [CommonModule,FormsModule],
  templateUrl: './owner-payment.component.html',
  styleUrl: './owner-payment.component.css'
})
export class OwnerPaymentComponent implements OnInit {


  constructor(private service: MyServiceService) { }

  ownerPayments: any[] = [];
  activePayments: any[] = [];
  deactivePayments: any[] = [];
  selectedVehicleNo: string = '';
  allVehicleNumbers: string[] = [];
  
  filteredVehicleNumbers: string[] = []; 
  vehicleSearchText: string = ''; //  ADDED
  showVehicleSearch: boolean = false; // ADDED
  
  // Recent selections
  recentSelections: string[] = []; 
  showRemoveConfirmation: boolean = false;
  vehicleToRemove: string = '';

  ngOnInit() {
    this.loadOwnerPaymentData();
  }

  loadOwnerPaymentData() {
    this.service.getAllOwnerPaymentDetails().subscribe({
      next: (res) => {
        this.ownerPayments = res;
        this.extractVehicleNumbers();
        this.loadRecentSelections(); 
        this.applyFilter();
      },
      error: (err) => {
        console.error("Failed to load owner payment data", err);
      }
    });
  }

  extractVehicleNumbers() {
    const numbers = this.ownerPayments
      .map(item => item.registrationNo || item.vehicleName)
      .filter((value): value is string => !!value && value.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort(); 
    
    this.allVehicleNumbers = numbers;
    this.filteredVehicleNumbers = [...numbers]; 
  }

  // Load recent selections from localStorage
  loadRecentSelections() {
    const saved = localStorage.getItem('ownerPaymentRecentVehicles');
    if (saved) {
      this.recentSelections = JSON.parse(saved);
    }
  }

  // Save recent selections to localStorage
  saveRecentSelections() {
    localStorage.setItem('ownerPaymentRecentVehicles', JSON.stringify(this.recentSelections));
  }

  // Add vehicle to recent selections
  addToRecentSelections(vehicleNo: string) {
    if (!this.recentSelections.includes(vehicleNo)) {
      this.recentSelections.unshift(vehicleNo);
      if (this.recentSelections.length > 10) {
        this.recentSelections = this.recentSelections.slice(0, 10);
      }
      this.saveRecentSelections();
    }
  }

  // Apply vehicle number filter
  applyFilter() {
    if (!this.selectedVehicleNo || this.selectedVehicleNo === 'all') {
      // Show all vehicles
      this.activePayments = this.ownerPayments.filter(x => x.status === 'Active');
      this.deactivePayments = this.ownerPayments.filter(x => x.status !== 'Active');
    } else {
      // Filter by selected vehicle number
      const filtered = this.ownerPayments.filter(item => 
        (item.registrationNo === this.selectedVehicleNo) || 
        (item.vehicleName === this.selectedVehicleNo)
      );
      
      this.activePayments = filtered.filter(x => x.status === 'Active');
      this.deactivePayments = filtered.filter(x => x.status !== 'Active');
      this.addToRecentSelections(this.selectedVehicleNo);
    }
  }

  // Filter vehicle options based on search
  filterVehicleOptions() {
    if (!this.vehicleSearchText.trim()) {
      this.filteredVehicleNumbers = [...this.allVehicleNumbers];
    } else {
      const search = this.vehicleSearchText.toLowerCase();
      this.filteredVehicleNumbers = this.allVehicleNumbers.filter(
        vehicle => vehicle.toLowerCase().includes(search)
      );
    }
  }

  // Toggle search input
  toggleVehicleSearch() {
    this.showVehicleSearch = !this.showVehicleSearch;
    if (this.showVehicleSearch) {
      this.filteredVehicleNumbers = [...this.allVehicleNumbers];
    }
  }

  //  Refresh data
  refreshData() {
    this.loadOwnerPaymentData();
  }

  //  Get popular vehicles
  getPopularVehicles(): string[] {
    if (this.ownerPayments.length === 0) return [];
    
    const vehicleCount: { [key: string]: number } = {};
    
    this.ownerPayments.forEach(item => {
      const vehicleNo = item.registrationNo || item.vehicleName;
      if (vehicleNo) {
        vehicleCount[vehicleNo] = (vehicleCount[vehicleNo] || 0) + 1;
      }
    });
    
    return Object.entries(vehicleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([vehicleNo]) => vehicleNo);
  }

  // Remove specific vehicle from recent selections
  removeFromRecentSelections(vehicleNo: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    this.vehicleToRemove = vehicleNo;
    this.showRemoveConfirmation = true;
  }

  // Confirm removal
  confirmRemove() {
    this.recentSelections = this.recentSelections.filter(v => v !== this.vehicleToRemove);
    this.saveRecentSelections();
    this.showRemoveConfirmation = false;
    this.vehicleToRemove = '';
  }

  // Cancel removal
  cancelRemove() {
    this.showRemoveConfirmation = false;
    this.vehicleToRemove = '';
  }

  // Clear all recent selections
  clearAllRecent() {
    this.recentSelections = [];
    this.saveRecentSelections();
  }

  // Reset to show all vehicles
  showAllVehicles() {
    this.selectedVehicleNo = 'all';
    this.applyFilter();
  }

  // Select specific vehicle
  selectVehicle(vehicleNo: string) {
    this.selectedVehicleNo = vehicleNo;
    this.applyFilter();
  }

  calculateTotalActive(): number {
    return this.activePayments.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  }

  calculateTotalDeactive(): number {
    return this.deactivePayments.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  }

  payNow(item: any) {
    const amount = item.totalAmount;
    const ownerId = item.ownerId;
    const vehicleId = item.vehicleId;

    this.service.createOwnerPaymentOrder(amount).subscribe({
      next: (res) => {

        const orderId = res.orderId;
        const options = {
          key: environment.SECRET_KEY_Razorpay, 
          amount: amount * 100,
          currency: 'INR',
          name: 'EZRide',
          description: 'Owner Vehicle Payment',
          order_id: orderId,

          handler: (response: any) => {

           const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            ownerId: ownerId,
            vehicleId: vehicleId,     
            amount: amount
          };
            this.service.verifyOwnerPayment(paymentData).subscribe({
              next: (verifyResponse) => {
                this.loadOwnerPaymentData();
              },
              error: (err) => {
                console.error("Payment verification failed", err);
                alert("Payment verification failed!");
              }
            });
          },
           modal: {
          ondismiss: () => {
            console.log("Payment modal closed ");
            this.loadOwnerPaymentData(); 
          }
        },
          
          theme: {
            color: "#10B981"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        console.error("Failed to create Razorpay order", err);
      }
    });
  }
}
