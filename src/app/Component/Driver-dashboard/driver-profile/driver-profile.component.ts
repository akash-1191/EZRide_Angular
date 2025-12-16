import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-profile',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './driver-profile.component.html',
  styleUrl: './driver-profile.component.css'
})
export class DriverProfileComponent implements OnInit {

  profiledata: any;
  isImageUploadModalOpen: boolean = false;
  isEditProfileModalOpen: boolean = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string = '';
  erromessage: any;
  successmessage: any;
  selectedFiles: { [key: string]: File } = {};
  hasUploaded: boolean = false;
  isUploaded: boolean = false;
  uploadedDocData: any = null;
  isExperienceModalOpen = false;
  driverExperienceData: any = null;


  // Document related
  documents: any[] = [];
  isDocumentModalOpen: boolean = false;
  documentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    file: new FormControl(null, [Validators.required])
  });
  selectedDocumentFile: File | null = null;
  editDocumentId: number | null = null;
  isAddDocumentModalOpen = false;
  newDocumentType = '';
  newDocumentFile: File | null = null;
documentTypeMap: { [key: number]: string } = {
    0: 'License',
    1: 'IDProof',
    2: 'AddressProof'
  };
  // All possible document types
 allDocumentTypes: string[] = [
  'License',
  'IDProof',
  'AddressProof'
];

mandatoryDocuments: string[] = [
  'License',
  'IDProof',
  'AddressProof'
];
vehicleTypeMap: { [key: number]: string } = {
  0: 'Two Wheeler',
  1: 'Four Wheeler',
  2: 'Both'
};

missingMandatoryDocuments: string[] = [];
allMandatoryUploaded = false;

  remainingDocumentTypes: string[] = [];

  isDeleteConfirmOpen = false;
  documentToDeleteId: number | null = null;
  errormessage: any;
  driverId: number = 0;



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

  //driver exprience
  driverExperienceForm: FormGroup = new FormGroup({
    experienceYears: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(50)
    ]),
       vehicleType: new FormControl('0', Validators.required), 
    availabilityStatus: new FormControl('Available', Validators.required)
  });
  
  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.getDriverExperience();
    
  }

 getDriverExperience() {
  this.services.getDriverExprience().subscribe({
    next: (res) => {
      this.driverExperienceData = res;

      if (res && res.driverId) {
        this.driverId = res.driverId;
        this.loadDocuments();
      }

      // YEH LINE CORRECT KARO:
      if (res) {
        this.driverExperienceForm.patchValue({
          experienceYears: res.experienceYears || '',
          vehicleType: res.vehicleTypes?.toString() || res.vehicleType?.toString() || '', // Convert to string
          availabilityStatus: res.availabilityStatus || 'Available'
        });
      }
    },
    error: () => {
      this.driverExperienceData = null;
      // Form reset karo agar data nahi hai
      this.driverExperienceForm.reset({
        experienceYears: '',
        vehicleType: '',
        availabilityStatus: 'Available'
      });
    }
  });
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
        console.log("response data",this.profiledata);
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



loadDocuments(): void {
  this.services.getDriverDocuments(this.driverId).subscribe({
    next: (res: any) => {
      this.documents = res.data || [];

      const uploadedTypes = this.documents.map(
  (d: any) => this.documentTypeMap[d.documentType]
);


      // dropdown logic (already correct)
      this.remainingDocumentTypes = this.allDocumentTypes.filter(
        type => !uploadedTypes.includes(type)
      );

      // mandatory missing logic
      this.missingMandatoryDocuments = this.mandatoryDocuments.filter(
        doc => !uploadedTypes.includes(doc)
      );

      this.allMandatoryUploaded = this.missingMandatoryDocuments.length === 0;

      // safety
      if (!this.remainingDocumentTypes.includes(this.newDocumentType)) {
        this.newDocumentType = '';
      }
    },
    error: () => {
      console.error('Failed to load documents');
    }
  });
}




  // Only one needed for PDF opening
  openPdf(url: string) {
    window.open(url, '_blank');
  }



  openDeleteConfirm(id: number) {
    this.documentToDeleteId = id;
    this.isDeleteConfirmOpen = true;
  }

  confirmDeleteDocument() {
    if (!this.documentToDeleteId) return;

    this.services.deleteDriverDocument(this.documentToDeleteId).subscribe({
      next: () => {
        this.loadDocuments();
        this.isDeleteConfirmOpen = false;
        this.documentToDeleteId = null;
      },
      error: (err) => {
        console.error("Delete failed:", err);
        this.errormessage = "Failed to delete document!";
      }
    });
  }

  cancelDelete() {
    this.isDeleteConfirmOpen = false;
    this.documentToDeleteId = null;
  }



  // Adddocumnet   Modal Methods
  openAddDocumentModal() {
    this.isAddDocumentModalOpen = true;
  }

  closeAddDocumentModal() {
    this.isAddDocumentModalOpen = false;
    this.newDocumentType = '';
    this.newDocumentFile = null;
  }

  onDocumentFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.newDocumentFile = event.target.files[0];
    }
  }

  submitNewDocument() {
    if (!this.newDocumentType || !this.newDocumentFile) {
      this.errormessage = "Please enter document type & choose file.";
      return;
    }

    
    const formData = new FormData();
    formData.append("DriverId", this.driverId.toString());
    formData.append("DocumentType", this.newDocumentType);
    formData.append("DocumentFile", this.newDocumentFile);


    this.services.addDriverDocument(formData).subscribe({
      next: () => {
        this.closeAddDocumentModal();
        this.loadDocuments();
      },
      error: (err) => console.error("Document Upload Failed:", err)
    });
  }


  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModals();
      this.closeAddDocumentModal();
      this.closeEditProfileModal();
      this.closeExperienceModal();
      this.closeImageUploadModal();
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



  submitDriverExperience() {
  if (this.driverExperienceForm.invalid) {
    this.driverExperienceForm.markAllAsTouched();
    
    // Debug ke liye console me form values dekho
    console.log('Form invalid:', this.driverExperienceForm.value);
    console.log('Form errors:', this.driverExperienceForm.errors);
    console.log('Vehicle Type Control:', this.driverExperienceForm.get('vehicleType'));
    
    return;
  }

  // Form values ko check karo
  const formValues = this.driverExperienceForm.value;
  
  // Vehicle type ko number me convert karo
  const formData = {
    experienceYears: Number(formValues.experienceYears),
    vehicleTypes: Number(formValues.vehicleType),
    availabilityStatus: formValues.availabilityStatus
  };
  
  

  this.services.AddUpdateDriverExprience(formData)
    .subscribe({
      next: (response) => {
        this.successmessage = 'Experience saved successfully';
        this.erromessage = null;
        
        setTimeout(() => {
          this.closeExperienceModal();
          this.getDriverExperience();
        }, 1500);
      },
      error: (error) => {
        this.erromessage = 'Failed to save experience';
        this.successmessage = null;
      }
    });
}

openExperienceModal() {
  this.isExperienceModalOpen = true;
  this.successmessage = null;
  this.erromessage = null;
  
  // Agar existing data hai toh form populate karo
  if (this.driverExperienceData) {
    this.driverExperienceForm.patchValue({
      experienceYears: this.driverExperienceData.experienceYears || '',
      vehicleType: this.driverExperienceData.vehicleType?.toString() || '', // Convert to string
      availabilityStatus: this.driverExperienceData.availabilityStatus || 'Available'
    });
  } else {
    // New entry ke liye form reset karo
    this.driverExperienceForm.reset({
      experienceYears: '',
      vehicleType: '',
      availabilityStatus: 'Available'
    });
  }
}

closeExperienceModal() {
  this.isExperienceModalOpen = false;
  this.successmessage = null;
  this.erromessage = null;
}

  


  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: any) {
    // this.UploadModalClose();
  }
}




