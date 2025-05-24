import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-own-profile',
  imports: [CommonModule,CommonModule,ReactiveFormsModule],
  templateUrl: './own-profile.component.html',
  styleUrl: './own-profile.component.css'
})
export class OwnProfileComponent {
  profiledata: any;
  isImageUploadModalOpen: boolean = false;
  isEditProfileModalOpen: boolean = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string = '';

  updateUserForm: FormGroup = new FormGroup({
    firstname: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z]*")]),
    middleName: new FormControl("", [Validators.pattern("[a-zA-Z]*")]),
    lastName: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z]*")]),
    age: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$")]),
    gender: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.required, Validators.pattern("^[0-9]{10}$")]),
    state: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
  });

  constructor(private services: MyServiceService ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;
      if (userId) {
        this.fetchUserProfile(userId);
      }
    }
  }

  fetchUserProfile(userId: number): void {
    this.services.UserProfiledata(userId).subscribe({
      next: (res) => {
        this.profiledata = res.data;
      },
      error: (err) => {
        console.error("Failed to fetch profile", err);
      }
    });
  }


   onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/image/DummyFprofile.png';
  }
  
  submitProfileUpdate(): void {
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;

      const updatedUserData = {
        userId,
        ...this.updateUserForm.value
      };

      this.services.UpdateUserData(updatedUserData).subscribe({
        next: (res) => {
          this.closeEditProfileModal();
          this.fetchUserProfile(userId);
        },
        error: (err) => {
          console.error("Update Failed:", err);
        }
      });
    }
  }

  openEditProfileModal(): void {
    this.isEditProfileModalOpen = true;
    if (this.profiledata) {
      this.updateUserForm.patchValue({
        firstname: this.profiledata.firstname || '',
        middleName: this.profiledata.middlename || '',
        lastName: this.profiledata.lastname || '',
        age: this.profiledata.age || '',
        gender: this.profiledata.gender || '',
        phone: this.profiledata.phone || '',
        state: this.profiledata.state || '',
        city: this.profiledata.city || '',
        address: this.profiledata.address || ''
      });
    } else {
      console.error('Profile data not loaded yet!');
    }
  }

  closeEditProfileModal(): void {
    this.isEditProfileModalOpen = false;
  }

  openImageUploadModal(): void {
    this.isImageUploadModalOpen = true;
  }

  closeImageUploadModal(): void {
    this.isImageUploadModalOpen = false;
  }

  submitImageUpload(): void {
    if (!this.selectedImage) {
     const imageErrorMessage ="Please select an image first.";
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;

      const formData = new FormData();
      formData.append('UserId',  userId.toString());
      formData.append('Image', this.selectedImage);

      this.services.updateUserImage(formData).subscribe({
        next: () => {
          // alert("Image uploaded successfully.");
          this.closeImageUploadModal();
          this.fetchUserProfile(userId);
        },
        error: (err) => {
          console.error("Image upload failed:", err);
        }
      });
    }
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

  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImage = input.files[0];

    // Optionally show a preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedImage);
  }
}
  // Form Getters
  get firstname() { return this.updateUserForm.get("firstname") as FormControl; }
  get middleName() { return this.updateUserForm.get("middleName") as FormControl; }
  get lastName() { return this.updateUserForm.get("lastName") as FormControl; }
  get age() { return this.updateUserForm.get("age") as FormControl; }
  get gender() { return this.updateUserForm.get("gender") as FormControl; }
  get phone() { return this.updateUserForm.get("phone") as FormControl; }
  get state() { return this.updateUserForm.get("state") as FormControl; }
  get city() { return this.updateUserForm.get("city") as FormControl; }
  get address() { return this.updateUserForm.get("address") as FormControl; }

}

