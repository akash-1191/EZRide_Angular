import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink,NgClass,NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isSticky = false;
  isNavbarOpen=false;

  @HostListener('window:scroll',[])
  onWindowScroll(){
    this.isSticky = window.scrollY > 10;
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }
}

