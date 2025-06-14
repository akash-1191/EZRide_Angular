import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-refund',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './security-refund.component.html',
  styleUrl: './security-refund.component.css'
})
export class SecurityRefundComponent implements OnInit {

  deposits: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  selectedType: string = '';
  filteredDeposits: any[] = [];

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
          this.applyFilter();
          // console.log("resdfjksd", res.data);
        } else {
          this.errorMessage = res.message || 'No deposits found.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching deposits.';
      }
    });
  }

  applyFilter() {
    if (this.selectedType === 'Pending') {
      this.filteredDeposits = this.deposits.filter(d => !d.refundedAt);
    } else if (this.selectedType === 'Refunded') {
      this.filteredDeposits = this.deposits.filter(d => !!d.refundedAt);
    } else {
      this.filteredDeposits = [...this.deposits];
    }
    this.currentPage = 1;
  }
}
