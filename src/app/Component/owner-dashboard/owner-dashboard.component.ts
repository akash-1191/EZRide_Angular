import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterOutlet,RouterLink,CommonModule,RouterModule ], 
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {

  private router = inject(Router)

 logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Role');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
