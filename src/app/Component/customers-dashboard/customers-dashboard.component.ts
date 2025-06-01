import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers-dashboard',
  imports: [RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './customers-dashboard.component.html',
  styleUrl: './customers-dashboard.component.css'
})
export class CustomersDashboardComponent {

  private router = inject(Router)

   logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Role');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
