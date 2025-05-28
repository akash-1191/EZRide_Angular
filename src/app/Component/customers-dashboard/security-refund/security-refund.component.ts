import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-refund',
  imports: [CommonModule],
  templateUrl: './security-refund.component.html',
  styleUrl: './security-refund.component.css'
})
export class SecurityRefundComponent implements OnInit {

  deposits: any[] = [];
  errorMessage: string = '';


  constructor(private service: MyServiceService) { }


  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'User not logged in.';
      return;
    }
    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      this.errorMessage = 'Invalid user token.';
      return;
    }

    this.loadDeposits(userId);

  }
  getUserIdFromToken(token: string): number | null {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.UserId || decoded.userId || null;
    } catch {
      return null;
    }
  }
  loadDeposits(userId: number) {
    this.service.getSecurityDepositsByUser(userId).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.deposits = res.data;
          console.log("resdfjksd", res.data);
        } else {
          this.errorMessage = res.message || 'No deposits found.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching deposits.';
      }
    });
  }
}
