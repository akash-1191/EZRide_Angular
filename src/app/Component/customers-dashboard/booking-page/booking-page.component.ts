import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';

@Component({
  selector: 'app-booking-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})

export class BookingPageComponent implements OnInit {
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
  amountBreakup = {
    rentAmount: 0,
    securityAmount: 0,
    totalAmount: 0
  };

  changeImage(image: string): void {
    this.selectedImage = 'http://localhost:7188/' + image;
  }
  // validation formmodal
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: MyServiceService, private router: Router) {
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
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;

    this.bookingForm = this.fb.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      dropoffTime: ['', Validators.required],
      driveBasis: ['', Validators.required],
      hoursToDrive: [null],  // for perHour
      daysToDrive: [null], // for perDay
      kmsToDrive: [null],//fro KM
    }, {
      validators: this.minimumBookingDurationValidator()
    });

    // when driveBasis or hoursToDrive/daysToDrive change then auto-update of he dropoff
    this.bookingForm.get('driveBasis')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('hoursToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('daysToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('kmsToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('pickupDate')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('pickupTime')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.valueChanges.subscribe(() => {
      this.bookingForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
  }

  // autoupdate dropof 
  updateDropoff() {
    const driveBasis = this.bookingForm.get('driveBasis')?.value;
    const pickupDate = this.bookingForm.get('pickupDate')?.value;
    const pickupTime = this.bookingForm.get('pickupTime')?.value;

    if (!pickupDate || !pickupTime) return;

    // Proper parsing of time into 24-hour format
    const [hoursStr, minutesStr] = pickupTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const pickup = new Date(pickupDate);
    pickup.setHours(hours, minutes, 0, 0);

    if (driveBasis === 'perHour') {
      const driveHours = this.bookingForm.get('hoursToDrive')?.value;
      if (driveHours && driveHours > 0) {
        const dropoff = new Date(pickup.getTime() + driveHours * 60 * 60 * 1000);
        this.bookingForm.patchValue({
          dropoffDate: dropoff.getFullYear() + '-' +
            String(dropoff.getMonth() + 1).padStart(2, '0') + '-' +
            String(dropoff.getDate()).padStart(2, '0'),
          dropoffTime: String(dropoff.getHours()).padStart(2, '0') + ':' +
            String(dropoff.getMinutes()).padStart(2, '0')
        }, { emitEvent: false });
      }
    } else if (driveBasis === 'perDay') {
      const days = this.bookingForm.get('daysToDrive')?.value;
      if (days && days > 0) {
        const dropoff = new Date(pickup.getTime() + days * 24 * 60 * 60 * 1000);
        this.bookingForm.patchValue({
          dropoffDate: dropoff.getFullYear() + '-' +
            String(dropoff.getMonth() + 1).padStart(2, '0') + '-' +
            String(dropoff.getDate()).padStart(2, '0'),
          dropoffTime: pickupTime  // Keep same time
        }, { emitEvent: false });
      }
    } else if (driveBasis === 'perKm') {
      this.bookingForm.patchValue({
        dropoffDate: '',
        dropoffTime: ''
      }, { emitEvent: false });
    }
  }


  minimumBookingDurationValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pickupDate = group.get('pickupDate')?.value;
      const pickupTime = group.get('pickupTime')?.value;
      const dropoffDate = group.get('dropoffDate')?.value;
      const dropoffTime = group.get('dropoffTime')?.value;

      if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
        return null;
      }

      const pickup = new Date(`${pickupDate}T${pickupTime}`);
      const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
      const diffInMinutes = (dropoff.getTime() - pickup.getTime()) / (1000 * 60);

      return diffInMinutes < 60 ? { minDuration: true } : null;
    };
  }

  //load vehicle ddetails

  loadVehicleDetails() {
    this.service.getVehicleDetailsById(this.vehicleId).subscribe({
      next: (res) => {
        this.vehicleDetails = res;
        if (res.imagePaths && res.imagePaths.length > 0) {
          const baseUrl = 'http://localhost:7188/';
          this.thumbnails = res.imagePaths.map((img: string) => baseUrl + img);
          this.selectedImage = this.thumbnails[0];
        } else {
          this.thumbnails = [];
          this.selectedImage = '../../../../assets/image/imageNotAvalible.png'; // Agar image na ho to blank
        }
      },
      error: (err) => console.error('Error fetching vehicle:', err)
    });
  }

  Booking() {
    if (this.bookingForm.valid) {
      this.bookingForm.value;

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
    'Please make sure you have uploaded your document before proceeding.'
  ];

  hindiTexts: string[] = [
    'वाहन ग्राहक की आवश्यकता के अनुसार प्रदान किया जाएगा।',
    'ईंधन वही मात्रा में लौटाना होगा जैसी मिली थी।',
    'वाहन में कोई डेंट नहीं होना चाहिए।',
    'मान्य ड्राइविंग लाइसेंस अनिवार्य है।',
    'किसी भी दुर्घटना या मृत्यु के लिए EZRide जिम्मेदार नहीं होगा।',
    'किसी भी डेंट या नुकसान की भरपाई ग्राहक को करनी होगी।',
    'कृपया सुनिश्चित करें कि आपने बुकिंग से पहले अपना दस्तावेज़ अपलोड किया है।'
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


  goToPreviewPage() {
    if (this.bookingForm.valid) {
      const amount = this.calculateAmountBreakup();

      const bookingData = {
        vehicleDetails: this.vehicleDetails,
        bookingFormValues: this.bookingForm.value,
        ...amount  // adds rentAmount, securityAmount, totalAmount
      };

      this.router.navigate(['/customer-dashboard/previewPage'], {
        state: { bookingData }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }


  //for privew page mate
  calculateAmountBreakup() {
    const driveBasis = this.bookingForm.get('driveBasis')?.value;
    const vehicle = this.vehicleDetails;
    let rentAmount = 0;
    let securityAmount = 0;

    if (!vehicle) return { rentAmount: 0, securityAmount: 0, totalAmount: 0 };

    // Rent calculation based on drive basis
    if (driveBasis === 'perHour') {
      const hours = this.bookingForm.get('hoursToDrive')?.value || 0;
      rentAmount = hours * (vehicle.pricePerHour || 0);
    } else if (driveBasis === 'perDay') {
      const days = this.bookingForm.get('daysToDrive')?.value || 0;
      rentAmount = days * (vehicle.pricePerDay || 0);
    } else if (driveBasis === 'perKm') {
      const kms = this.bookingForm.get('kmsToDrive')?.value || 0; // assuming kmsToDrive control exists
      rentAmount = kms * (vehicle.pricePerKm || 0);
    }

    // Security deposit based on vehicle type
    securityAmount = vehicle.securityDepositAmount;

    const totalAmount = rentAmount + securityAmount;

    return {
      rentAmount,
      securityAmount,
      totalAmount
    };
  }

  openModal(): void {
    this.showModal = true;
     const enArr = this.formcheckcondition.get('englishTerms') as FormArray;
  const hiArr = this.formcheckcondition.get('hindiTerms') as FormArray;

  enArr.clear();
  hiArr.clear();
    this.initCheckboxes();
  }

  closeModal(): void {
    this.showModal = false;
    this.isImageUploaded = false;
    this.selectedImage = this.thumbnails[0];
    this.activeTab = 'en';
    this.initCheckboxes();
    this.clearCheckboxes();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      if (this.showModal) {
        this.closeModal();

      }
    }
  }

  //clear termcondition bokx data
  clearCheckboxes() {
    const enArr = this.englishTerms;
    const hiArr = this.hindiTerms;

    while (enArr.length !== 0) {
      enArr.removeAt(0);
    }
    while (hiArr.length !== 0) {
      hiArr.removeAt(0);
    }
  }



}
