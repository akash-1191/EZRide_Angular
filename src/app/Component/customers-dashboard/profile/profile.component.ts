import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

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
  selectedImage: File | null = null;
  imagePreviewUrl: string = '';
  isUploadModalOpen: boolean = false;
  erromessage: any;
  successmessage: any;
  selectedFiles: { [key: string]: File } = {};
  hasUploaded: boolean = false;
  isUploaded: boolean = false;
  uploadedDocData: any = null;

  uploadedFileNames = {
    AgeProof: '',
    AddressProof: '',
    DLProof: ''
  };


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

  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadUserDocuments();
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
        // console.log("response data",this.profiledata);
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
      const imageErrorMessage = "Please select an image first.";
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;

      const formData = new FormData();
      formData.append('UserId', userId.toString());
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


  // get uploaded documnet 
  loadUserDocuments() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;

      this.services.getCustomerDocument(userId).subscribe({
        next: (res) => {
          this.uploadedDocData = res;
          console.log("response"+res);
          // this.uploaddocumnet.reset();

          if (res.ageProofPath) {
            this.uploadedFileNames.AgeProof = this.extractFileName(res.ageProofPath);
          } else {
            this.uploadedFileNames.AgeProof = '';
          }

          if (res.addressProofPath) {
            this.uploadedFileNames.AddressProof = this.extractFileName(res.addressProofPath);
          } else {
            this.uploadedFileNames.AddressProof = '';
          }

          if (res.dlImagePath) {
            this.uploadedFileNames.DLProof = this.extractFileName(res.dlImagePath);
          } else {
            this.uploadedFileNames.DLProof = '';
          }
        },
        error: (err) => {
          console.log("No documents found");
        }
      });
    }
  }


  // get image as type of pdf and image 
  getFileType(path: string): 'image' | 'pdf' | 'unknown' {
    if (!path) return 'unknown';
    const ext = path.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext!)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'unknown';
  }

  //upload documnet section code
  uploaddocumnet: FormGroup = new FormGroup({
    DLProof: new FormControl("", [Validators.required]),
    AddressProof: new FormControl("", [Validators.required]),
    AgeProof: new FormControl("", [Validators.required]),
  });


  get DLProof() { return this.uploaddocumnet.get("DLProof") as FormControl; }
  get AddressProof() { return this.uploaddocumnet.get("AddressProof") as FormControl; }
  get AgeProof() { return this.uploaddocumnet.get("AgeProof") as FormControl; }


  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      this.erromessage = `Invalid file type for ${field}. Allowed: JPG, JPEG, PNG, PDF.`;
      this.uploaddocumnet.get(field)?.setErrors({ invalidExtension: true });
      this.selectedFiles[field] = file;
      this.uploaddocumnet.get(field)?.markAsTouched();
      this.uploaddocumnet.get(field)?.updateValueAndValidity();
      return;
    }

    if (file.size > maxFileSize) {
      this.erromessage = `File size for ${field} cannot exceed 5 MB.`;
      this.uploaddocumnet.get(field)?.setErrors({ maxSizeExceeded: true });
      this.selectedFiles[field] = file;
      this.uploaddocumnet.get(field)?.markAsTouched();
      this.uploaddocumnet.get(field)?.updateValueAndValidity();
      return;
    }

    // Clear previous error message if validation passed
    this.erromessage = null;

    this.selectedFiles[field] = file;
    this.uploaddocumnet.get(field)?.setErrors(null);
    this.uploaddocumnet.get(field)?.markAsTouched();
    this.uploaddocumnet.get(field)?.updateValueAndValidity();
  }


  onUpload() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decode: any = jwtDecode(token);
      const userId = decode.UserId || decode.userId;


      const formData = new FormData();
      formData.append("UserId", userId.toString());
      formData.append("AgeProof", this.selectedFiles["AgeProof"]);
      formData.append("AddressProof", this.selectedFiles["AddressProof"]);
      formData.append("DLImage", this.selectedFiles["DLProof"]);
      formData.append("Status", "Active");

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }
      this.services.uploadDocuments(formData).subscribe({
        next: (res) => {
          this.successmessage = "Documents uploaded successfully!";
        
        },
        error: (err) => {
          this.erromessage = "Failed to upload documents. Please try again.";
          this.successmessage = null;
        }
      });
    }
  }


  UploadModalClose() {
    this.isUploadModalOpen = false;
    this.loadUserDocuments();
  }

  extractFileName(path: string): string {
    if (!path) return '';
    return path.split('/').pop() || '';
  }

  UploadModalOpen() {
    this.isUploadModalOpen = true;
    this.successmessage = null;
    this.erromessage = null;
    this.selectedFiles = {};

    const token = sessionStorage.getItem('token');
    if (!token) return;

    const decode: any = jwtDecode(token);
    const userId = decode.UserId || decode.userId;

    //  First fetch document data

    this.loadUserDocuments();
    //  Check full-document upload block
    this.services.checkDocumentsUploaded(userId).subscribe(res => {
      if (res.exists) {
        this.erromessage = "You have already uploaded documents. Please delete existing documents to upload new ones.";
        this.isUploaded = true;
      } else {
        this.erromessage = null;
        this.isUploaded = false;
      }
    });
  }


  deleteDocumentField(fieldName: string): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    const decode: any = jwtDecode(token);
    const userId = decode.UserId || decode.userId;

    this.services.updateUserDocumentFieldToNull(userId, fieldName).subscribe({
      next: (res) => {
        console.log('Document field null successfully', res);
        this.loadUserDocuments() // UI refresh
      },
      error: (err) => console.error('Error:', err)
    });
  }
    @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    this.UploadModalClose();
  }
}


