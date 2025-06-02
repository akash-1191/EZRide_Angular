import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  totalBooking = 0;
  userId: number = 0;
  errormessage: string = '';
  bikecount: any;
  carcount: any;
  avaliblevehicle: any;
  pendingAmount: number = 0;
  amount: number = 0;
 refundedAt: Date | string = '';

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      this.userId = decode.UserId || decode.userId;
      if (this.userId) {
        this.TotalBookingsCount();
        this.TatolVehicleBookingCount();
        this.TatolAvalibleVehicleCount();
        this.pandingAmount();
        this.LastRefendedamount();
      }
    }
  }


  TotalBookingsCount(): void {
    this.services.TotalBookingsCount(this.userId).subscribe({
      next: (data) => {
        this.totalBooking = data.totalBookings;
      },
      error: (err) => {
        this.errormessage = "Error fetching bookings:";
      }
    });
  }


  TatolVehicleBookingCount(): void {
    this.services.TatolVehicleBookingCount(this.userId).subscribe({
      next: (data1) => {
        this.bikecount = data1.bikeCount;
        this.carcount = data1.carCount;
      },
      error: (err1) => {
        this.errormessage = "Error fetching bookings";
      }
    });
  }


  TatolAvalibleVehicleCount(): void {
    this.services.TatolAvalibleVehicleCount().subscribe({
      next: (data2) => {
        this.avaliblevehicle = data2;
      },
      error: (err1) => {
        this.errormessage = "Error fetching bookings";
      }
    });
  }

  pandingAmount(): void {
    this.services.pandingAmount(this.userId).subscribe({
      next: (res) => {
        this.pendingAmount = res;
      },
      error: () => {
        this.errormessage = "Error fetching bookings";
      }
    })
  }

  LastRefendedamount(): void {
    this.services.LastRefendedamount(this.userId).subscribe({
      next: (res1) => {
        this.amount = res1.amount;
        this.refundedAt= new Date(res1.refundedAt);
      },
      error: () => {
        this.errormessage = "Error fetching bookings";
      }
    })
  }




}
