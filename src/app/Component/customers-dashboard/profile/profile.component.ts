import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {


  profiledata: any;
  isImageUploadModalOpen: boolean = false;
  isEditProfileModalOpen: boolean = false;
  emailError: string = "";

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('token');
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

  submitProfileUpdate() {
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }
    const token = localStorage.getItem('token')
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;
      if (userId) {
        const updatedUserData = {
          userId,
          ...this.updateUserForm.value
        };

        this.services.UpdateUserData(updatedUserData).subscribe({
          next: (res) => {
            this.profiledata = res.data;
            this.profiledata = updatedUserData
            this.closeEditProfileModal();
            this.fetchUserProfile(userId);
          },
          error: (err) => {
            console.error("Update Failed:", err);
          }
        });
      }
    }
  }



  updateUserForm: FormGroup = new FormGroup({
    firstname: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z]*")]),
    MiddleName: new FormControl("", [Validators.pattern("[a-zA-Z]*")]),
    LastName: new FormControl("", [Validators.required, Validators.pattern("[A-Za-z]*")]),
    Age: new FormControl("", [Validators.required, Validators.pattern("[0-9]*")]),
    Gender: new FormControl("", [Validators.required]),
    phone: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*")]),
    State: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    Address: new FormControl("", [Validators.required]),
  });

  get firstname(): FormControl { return this.updateUserForm.get("firstname") as FormControl; }
  get MiddleName(): FormControl { return this.updateUserForm.get("MiddleName") as FormControl; }
  get LastName(): FormControl { return this.updateUserForm.get("LastName") as FormControl; }
  get Age(): FormControl { return this.updateUserForm.get("Age") as FormControl; }
  get Gender(): FormControl { return this.updateUserForm.get("Gender") as FormControl; }
  get phone(): FormControl { return this.updateUserForm.get("phone") as FormControl; }
  get State(): FormControl { return this.updateUserForm.get("State") as FormControl; }
  get city(): FormControl { return this.updateUserForm.get("city") as FormControl; }
  get Address(): FormControl { return this.updateUserForm.get("Address") as FormControl; }



  openImageUploadModal(): void {
    this.isImageUploadModalOpen = true;
  }

  closeImageUploadModal(): void {
    this.isImageUploadModalOpen = false;
  }

  openEditProfileModal(): void {
    this.isEditProfileModalOpen = true;
    if (this.profiledata) {
      this.updateUserForm.patchValue({
        firstname: this.profiledata.firstname || '',
        MiddleName: this.profiledata.middlename || '',
        LastName: this.profiledata.lastname || '',
        Age: this.profiledata.age || '',
        Gender: this.profiledata.gender || '',
        phone: this.profiledata.phone || '',
        State: this.profiledata.state || '',
        city: this.profiledata.city || '',
        Address: this.profiledata.address || ''
      });
    } else {
      console.error('Profile data is not loaded yet!');
    }
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
