import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterOutlet,RouterLink], 
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {

  private router = inject(Router)

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
