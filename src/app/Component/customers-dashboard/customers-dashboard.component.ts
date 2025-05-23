import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers-dashboard',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './customers-dashboard.component.html',
  styleUrl: './customers-dashboard.component.css'
})
export class CustomersDashboardComponent {

  private router = inject(Router)

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
