import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
 isDropdownOpen=false;
 userPanelOpen: boolean = false;
 ownerPanelOpen: boolean = false;
 isSidebarOpen: boolean = false;
 
 toggleSidebar() {
   this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  
  private router = inject(Router)
  private elementRef = inject(ElementRef); // required for click outside detection

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Role');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
   toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


   @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedInsideSidebar = this.elementRef.nativeElement.querySelector('#sidebar')?.contains(event.target);
    const clickedToggleButton = this.elementRef.nativeElement.querySelector('#toggleSidebarBtn')?.contains(event.target);

    if (!clickedInsideSidebar && !clickedToggleButton) {
      this.isSidebarOpen = false;
    }
  }
}
