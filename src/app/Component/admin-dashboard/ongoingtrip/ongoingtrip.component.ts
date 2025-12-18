import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ongoingtrip',
  imports: [FormsModule, CommonModule],
  templateUrl: './ongoingtrip.component.html',
  styleUrl: './ongoingtrip.component.css'
})
export class OngoingtripComponent implements OnInit {




  constructor(private services: MyServiceService, private router: Router) { }


  drivers: any[] = [];

  selectedDriver: any = null;
  successMessage: string = '';
  errorMessage: string = '';

  approvedDrivers: any[] = [];



  ngOnInit() {
    this.loadDrivers();
  }

  /* LOAD DRIVERS */
  loadDrivers() {
    this.services.GetAllDriverDetials().subscribe({
      next: (res) => {
        this.drivers = res.data || [];
        this.approvedDrivers = this.drivers.filter(driver => driver.userStatus === 'Active');
      },
      error: () => {
        this.errorMessage = 'Failed to load drivers';
      }
    });
  }

  goToDriverBooking(driverId: number) {
    this.router.navigate(['admin-dashboard/driverbookingdata', driverId]);
  }

}

