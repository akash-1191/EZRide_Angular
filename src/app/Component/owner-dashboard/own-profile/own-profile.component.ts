import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-own-profile',
  imports: [CommonModule],
  templateUrl: './own-profile.component.html',
  styleUrl: './own-profile.component.css'
})
export class OwnProfileComponent {
  isImageUploadModalOpen: boolean = false;
  isEditProfileModalOpen: boolean = false;




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
