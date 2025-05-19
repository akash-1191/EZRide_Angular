import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
 isDropdownOpen=false;
  private router = inject(Router)
  userPanelOpen: boolean = false;
ownerPanelOpen: boolean = false;

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
   toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
