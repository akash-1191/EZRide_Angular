import { Component, OnInit } from '@angular/core';
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

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;
      this.loadBookings(userId);
    } else {
      this.errorMsg = 'User not logged in';
    }
  }

  loadBookings(userId: number) {
    this.services.gatAllDataOftheBooking(userId).subscribe({
      next: (res) => {
        this.bookings = res.data || res;
        console.log(res);
      },
      error: (err) => {
        this.errorMsg = 'Failed to load bookings';
        console.error(err);
      }
    });
  }
}
