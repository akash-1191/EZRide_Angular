import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
// Modal state for image upload and profile edit
isImageUploadModalOpen: boolean = false;
isEditProfileModalOpen: boolean = false;

// Open Image Upload Modal
openImageUploadModal(): void {
  this.isImageUploadModalOpen = true;
}

// Close Image Upload Modal
closeImageUploadModal(): void {
  this.isImageUploadModalOpen = false;
}

// Open Edit Profile Modal
openEditProfileModal(): void {
  this.isEditProfileModalOpen = true;
}

// Close Edit Profile Modal
closeEditProfileModal(): void {
  this.isEditProfileModalOpen = false;
}
// Listen for the ESC key to close modals
@HostListener('document:keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
if (event.key === 'Escape') {
  this.closeModals();
}
}

// Close both modals
closeModals(): void {
this.isImageUploadModalOpen = false;
this.isEditProfileModalOpen = false;
}
}
