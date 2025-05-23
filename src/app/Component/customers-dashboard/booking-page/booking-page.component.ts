import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';

@Component({
  selector: 'app-booking-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})

export class BookingPageComponent {
  activeTab: 'en' | 'hi' = 'en';
  isImageUploaded: boolean = false;
  imageFile: File | null = null;
  showModal = false;
  formcheckcondition: FormGroup;
  bookingForm!: FormGroup;
  todayDate: string = '';
  currentTime: string = '';
  thumbnails: string[] = [];

  vehicleId!: number;
  vehicleDetails: any;


  selectedImage: string = this.thumbnails[0];

  changeImage(image: string): void {
    this.selectedImage = 'http://localhost:7188/' + image;
  }
  // validation formmodal
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: MyServiceService) {
    this.formcheckcondition = this.fb.group({
      englishTerms: this.fb.array([]),
      hindiTerms: this.fb.array([])
    });

    this.initCheckboxes();
  }

  // validation for the dattime
  ngOnInit() {
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.loadVehicleDetails();
    const now = new Date();
    // Format: YYYY-MM-DD
    this.todayDate = now.toISOString().split('T')[0];
    // Format: HH:MM (24-hour)
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;

    this.bookingForm = this.fb.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      dropoffTime: ['', Validators.required]
    });
  }

  //load vehicle ddetails

  loadVehicleDetails() {
    this.service.getVehicleDetailsById(this.vehicleId).subscribe({
      next: (res) => {
        this.vehicleDetails = res;
        if (res.imagePaths && res.imagePaths.length > 0) {
           const baseUrl = 'http://localhost:7188/';  // <-- yahan apna backend url daalo
        this.thumbnails = res.imagePaths.map((img:string) => baseUrl + img);
        this.selectedImage = this.thumbnails[0]; // Pehla image selected hoga
        } else {
          this.thumbnails = [];
          this.selectedImage = ''; // Agar image na ho to blank
        }

        console.log("Booking Page Data:", res);
      },
      error: (err) => console.error('Error fetching vehicle:', err)
    });
  }

  Booking() {
    if (this.bookingForm.valid) {
      console.log('Form Data:', this.bookingForm.value);

    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  // Text for checkboxes
  englishTexts: string[] = [
    'Vehicle will be provided based on customer requirements.',
    'Fuel must be returned at the same level as when taken.',
    'Vehicle should not have any dents upon return.',
    'Valid Driving License is mandatory.',
    'EZRide is not responsible for any accidental deaths.',
    'Any damage or dent cost must be borne by the customer.',
    'Upload Driving License (Image below).'
  ];

  hindiTexts: string[] = [
    'वाहन ग्राहक की आवश्यकता के अनुसार प्रदान किया जाएगा।',
    'ईंधन वही मात्रा में लौटाना होगा जैसी मिली थी।',
    'वाहन में कोई डेंट नहीं होना चाहिए।',
    'मान्य ड्राइविंग लाइसेंस अनिवार्य है।',
    'किसी भी दुर्घटना या मृत्यु के लिए EZRide जिम्मेदार नहीं होगा।',
    'किसी भी डेंट या नुकसान की भरपाई ग्राहक को करनी होगी।',
    'ड्राइविंग लाइसेंस की छवि अपलोड करें।'
  ];

  // Create 7 checkbox controls for both tabs
  private initCheckboxes() {
    const enArr = this.formcheckcondition.get('englishTerms') as FormArray;
    const hiArr = this.formcheckcondition.get('hindiTerms') as FormArray;

    for (let i = 0; i < 7; i++) {
      enArr.push(this.fb.control(false));
      hiArr.push(this.fb.control(false));
    }
  }
  get englishTerms() {
    return this.formcheckcondition.get('englishTerms') as FormArray;
  }

  get hindiTerms() {
    return this.formcheckcondition.get('hindiTerms') as FormArray;
  }


  onCheckboxChange(index: number, tab: 'en' | 'hi', event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const formArray = tab === 'en' ? this.englishTerms : this.hindiTerms;
    formArray.at(index).setValue(checked);
  }

  allChecked(): boolean {
    const currentArray = this.activeTab === 'en' ? this.englishTerms : this.hindiTerms;
    return currentArray.controls.every(ctrl => ctrl.value === true);
  }

  onSubmit() {
    if (this.allChecked()) {
      this.closeModal();
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isImageUploaded = false;
    this.selectedImage = this.thumbnails[0];
    this.activeTab = 'en';
    this.initCheckboxes();
  }


}
