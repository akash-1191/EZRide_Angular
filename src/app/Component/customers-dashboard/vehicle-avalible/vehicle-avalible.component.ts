import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-avalible',
  imports: [CommonModule],
  templateUrl: './vehicle-avalible.component.html',
  styleUrl: './vehicle-avalible.component.css'
})
export class VehicleAvalibleComponent implements OnInit {
  selectedTab: string = 'all';
  private router = inject(Router);
  allVehicles: any[] = [];
  filteredVehicles: any[] = [];
  filteredBikes: any[] = [];
  carVehicles: any[] = [];
  bikeVehicles: any[] = [];
  showdatabike:any[]=[];
  showdatacar:any[]=[];


  constructor(private myService: MyServiceService, private cdr: ChangeDetectorRef) { }

 
goToBookingPage(vehicleId: number) {
  this.router.navigate(['/customer-dashboard/custBookingpage', vehicleId]);
  console.log("vehicleid is"+vehicleId);
}

  ngOnInit(): void {
    this.loadAllVehicles();

  }

  filterVehicles(type: string): void {
    this.selectedTab = type;

    if (type.toLowerCase() === 'all') {
      this.filteredVehicles = [...this.allVehicles]; // all vehicles
    } else if (type.toLowerCase() === 'car') {
      this.carVehicles = this.allVehicles.filter(
        v => v.type?.toLowerCase() === 'car'
      
      );
      this.showdatacar = [...this.carVehicles]; // show cars only
    } else if (type.toLowerCase() === 'bike') {
      this.bikeVehicles = this.allVehicles.filter(
        v => v.type?.toLowerCase() === 'bike'
      );
      this.showdatabike = [...this.bikeVehicles]; // show bikes only
     
    }

  }

  loadAllVehicles(): void {
    this.myService.getAllVehiclesdetails().subscribe({
      next: (res) => {
        console.log('Vehicle Data:', res);
        this.allVehicles = res;
        // console.log("All Vehicles before filter:", this.allVehicles);
        this.filterVehicles(this.selectedTab);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching vehicle data:', err);
      }
    });
  }
}
