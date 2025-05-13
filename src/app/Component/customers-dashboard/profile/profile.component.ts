import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profiledata: any;
  isImageUploadModalOpen: boolean = false;
  isEditProfileModalOpen: boolean = false;

  constructor(private services: MyServiceService) { }


  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId;
      if (userId) {
        this.services.UserProfiledata(userId).subscribe({
          next: (res) => {
            this.profiledata = res.data
          },
          error: (err) => {
            console.error("Failed to fetch profile", err);
          }
        });
      }
    }

  }



  openImageUploadModal(): void {
    this.isImageUploadModalOpen = true;
  }

  closeImageUploadModal(): void {
    this.isImageUploadModalOpen = false;
  }

  openEditProfileModal(): void {
    this.isEditProfileModalOpen = true;
  }


  closeEditProfileModal(): void {
    this.isEditProfileModalOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModals();
    }
  }

  closeModals(): void {
    this.isImageUploadModalOpen = false;
    this.isEditProfileModalOpen = false;
  }

}
