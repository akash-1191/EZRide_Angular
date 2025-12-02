import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-driver-dashboard',
  imports: [RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './driver-dashboard.component.html',
  styleUrl: './driver-dashboard.component.css'
})
export class DriverDashboardComponent {

private router = inject(Router)

   logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Role');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}

