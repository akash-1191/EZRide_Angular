import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';  // Date adapter for native JS Date
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
  selector: 'app-booking-page',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgxMatTimepickerModule],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})

export class BookingPageComponent implements OnInit {



selectedDriver: any = null;
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

  bookedDates: Set<string> = new Set();
  bookedSlots: { startDateTime: string, endDateTime: string }[] = [];
  availabilityColor: 'green' | 'red' | null = null;
  minDate: Date = new Date();
  minTime: string = '';

  availabilitySlotsByDate: Record<string, { startTime: string, endTime: string }[]> = {};
  vehicleAvailability: any;
  maxDate: Date | null = null;


  // driver section 
  showDriverSection = true;  // To toggle driver details section
  showTermsSection = false;

  availableDrivers: any[] = [];




  changeImage(image: string): void {
    this.selectedImage = 'http://localhost:7188/' + image;
  }
  // validation formmodal
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: MyServiceService, private router: Router) {
    // this.loadDriverDetails();
    this.formcheckcondition = this.fb.group({
      englishTerms: this.fb.array([]),
      hindiTerms: this.fb.array([])
    });

    this.initCheckboxes();
  }
 // Filter drivers based on the selected vehicle type (Car/Bike)
loadAvailableDrivers() {
 
  if (!this.bookingForm) {
    return;
  }

  const pickupDate = this.bookingForm.get('pickupDate')?.value;
  const pickupTime = this.bookingForm.get('pickupTime')?.value;
  const dropoffDate = this.bookingForm.get('dropoffDate')?.value;
  const dropoffTime = this.bookingForm.get('dropoffTime')?.value;


  //  Date/time missing check
  if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    this.availableDrivers = [];
    return;
  }

  // Date objects
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);

  // Time parse (AM/PM + 24h both)
  const pickupParsed = this.convertTimeTo24Hour(pickupTime);
  const dropoffParsed = this.convertTimeTo24Hour(dropoffTime);

  if (!pickupParsed || !dropoffParsed) {
    this.availableDrivers = [];
    return;
  }

  start.setHours(pickupParsed.hours, pickupParsed.minutes, 0, 0);
  end.setHours(dropoffParsed.hours, dropoffParsed.minutes, 0, 0);

  //  Final safety check
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    this.availableDrivers = [];
    return;
  }

 
  // Vehicle type
  const vehicleType = this.vehicleDetails?.type;
 
  if (!vehicleType) return;

  //  API call
  this.service.getAvailableDrivers(
    start.toISOString(),
    end.toISOString(),
    vehicleType
  ).subscribe({
    next: (res) => {
      this.availableDrivers = res;
    },
    error: (err) => {
      console.error(' API ERROR:', err);
      this.availableDrivers = [];
    }
  });
}

  // When skip is clicked, show terms and conditions
  onSkip() {
     if (this.bookingForm.get('driveBasis')?.value === 'perKm') {
    alert('⚠ Per KM booking is allowed only with Driver');
    return;
  }
    this.showDriverSection = false;
    this.showTermsSection = true;
  }

  loadVehicleAvailability() {
    this.service.getAllVehiclesFTheOwnerVehicle(this.vehicleId).subscribe({
      next: (res) => {
        this.vehicleAvailability = res;
        // OWNER vehicle → limit dates
        if (res.ownershipType === 'OWNER' && res.status === 'Active') {
          this.minDate = new Date(res.availableFrom);
          this.maxDate = new Date(res.availableTo);
        }

        // EXPIRED → booking disable
        if (res.status === 'Expired') {
          this.bookingForm.disable();
        }
      },
      error: (err) => console.error('Availability error', err)
    });
  }

  loadUnavailableSlots(): Promise<void> {
    return new Promise((resolve, reject) => {
      const vehicleId = this.vehicleId;
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 730);

      const startDateTime = start.toISOString();
      const endDateTime = end.toISOString();

      this.service.getAvailability(vehicleId, startDateTime, endDateTime).subscribe({
        next: (res) => {

          this.bookedSlots = res.filter(x => x.isAvailable === false);
          this.bookedDates.clear();

          this.bookedSlots.forEach(slot => {
            const start = new Date(slot.startDateTime);
            const end = new Date(slot.endDateTime);

            // Normalize start and end to 00:00:00 to only care about dates
            let current = new Date(start);
            current.setHours(0, 0, 0, 0);

            const endDate = new Date(end);
            endDate.setHours(0, 0, 0, 0);

            while (current <= endDate) {
              const dateStr = current.toISOString().split('T')[0]; // 'YYYY-MM-DD'
              this.bookedDates.add(dateStr);
              current.setDate(current.getDate() + 1);
            }
          });
          // console.log(' Booked slots loaded:', this.bookedSlots); //  Add this
          resolve();
        },
        error: (err) => {
          // console.error('Failed to load availability', err);
          reject(err);
        }
      });
    });
  }


  isDateDisabled = (date: Date): boolean => {
    if (!date) return false;
    const dateOnly = date.toISOString().split('T')[0];
    return !this.bookedDates.has(dateOnly);
  };

  isDateAvailable = (date: Date | null): boolean => {
    if (!date) return false;
    const dateOnly = date.toISOString().split('T')[0];
    // already booked
    if (this.bookedDates.has(dateOnly)) return false;

    //  before owner availability
    if (this.vehicleAvailability?.availableFrom) {
      if (date < new Date(this.vehicleAvailability.availableFrom)) return false;
    }

    //  after owner availability
    if (this.vehicleAvailability?.availableTo) {
      if (date > new Date(this.vehicleAvailability.availableTo)) return false;
    }

    return true;
  };
  checkAvailabilityStatus() {
    const pickupDate = this.bookingForm.get('pickupDate')?.value;
    const pickupTime = this.bookingForm.get('pickupTime')?.value;

    if (!pickupDate || !pickupTime || typeof pickupTime !== 'string' || !pickupTime.includes(':')) {
      this.availabilityColor = null;
      return;
    }

    const pickup = new Date(pickupDate);

    if (isNaN(pickup.getTime())) {
      console.error('Invalid pickup date:', pickupDate);
      this.availabilityColor = null;
      return;
    }

    const [hoursStr, minutesStr] = pickupTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid pickup time:', pickupTime);
      this.availabilityColor = null;
      return;
    }

    pickup.setHours(hours, minutes, 0, 0);

    if (isNaN(pickup.getTime())) {
      console.error('Final pickup datetime is invalid:', pickup);
      this.availabilityColor = null;
      return;
    }

    const selectedTimeISO = pickup.toISOString();

    const foundUnavailable = this.bookedSlots.some(slot =>
      selectedTimeISO >= new Date(slot.startDateTime).toISOString() &&
      selectedTimeISO < new Date(slot.endDateTime).toISOString()
    );

    this.availabilityColor = foundUnavailable ? 'red' : 'green';
  }


  // validation for the dattime
  async ngOnInit() {
     this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    
    const now = new Date();
    this.minDate = now; 
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.minTime = `${hours}:${minutes}`;
    
    this.bookingForm = this.fb.group({
      pickupDate: [null, Validators.required],
      pickupTime: ['', Validators.required],
      dropoffDate: [null, Validators.required],
      dropoffTime: ['', Validators.required],
      driveBasis: ['', Validators.required],
      hoursToDrive: [null],  // for perHour
      daysToDrive: [null], // for perDay
      kmsToDrive: [null],//fro KM
    }, {
      validators: this.minimumBookingDurationValidator()
    });
 

// const now:Date = new Date();
//   this.minDate = now;
//   this.minTime = `${now.getHours().toString().padStart(2, '0')}:
//   ${now.getMinutes().toString().padStart(2, '0')}`;

  // ✅ 4. VEHICLE & AVAILABILITY
  this.loadVehicleDetails();
  this.loadVehicleAvailability();
  await this.loadUnavailableSlots();


     this.bookingForm.get('driveBasis')?.valueChanges.subscribe(() => {
    this.updateDropoff();
    this.manageDropoffControlState();
  });



   
    this.bookingForm.get('driveBasis')?.valueChanges.subscribe(() => { this.updateDropoff(); this.manageDropoffControlState(); });
    this.bookingForm.get('hoursToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('daysToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('kmsToDrive')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('pickupDate')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('pickupTime')?.valueChanges.subscribe(() => this.updateDropoff());
    this.bookingForm.get('pickupDate')?.valueChanges.subscribe(() => {
      this.updateDropoff();
      this.checkAvailabilityStatus();
    });
    this.bookingForm.get('pickupTime')?.valueChanges.subscribe(() => {
      this.updateDropoff();
      this.checkAvailabilityStatus();
    });

    this.bookingForm.valueChanges.subscribe(() => {
      this.bookingForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
     this.bookingForm.valueChanges.subscribe(() => {
    if (this.bookingForm.valid) {
      this.loadAvailableDrivers();
    }
  });
  }

convertTimeTo24Hour(time: string): { hours: number; minutes: number } | null {
  if (!time) return null;

  // Case 1: already 24-hour format (e.g. 16:29)
  if (!time.toLowerCase().includes('am') && !time.toLowerCase().includes('pm')) {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return { hours: h, minutes: m };
  }

  // Case 2: 12-hour format (e.g. 6:29 AM)
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}


  // autoupdate dropof 
  updateDropoff() {
    const driveBasis = this.bookingForm.get('driveBasis')?.value;
    const pickupDate: Date = this.bookingForm.get('pickupDate')?.value;
    const pickupTime: string = this.bookingForm.get('pickupTime')?.value;

    if (!pickupDate || !pickupTime) return;

    const pickup = new Date(pickupDate);
    const [hoursStr, minutesStr] = pickupTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    pickup.setHours(hours, minutes, 0, 0);

    if (driveBasis === 'perHour') {
      const driveHours = this.bookingForm.get('hoursToDrive')?.value;
      if (driveHours && driveHours > 0) {
        const dropoff = new Date(pickup.getTime() + driveHours * 60 * 60 * 1000);
        this.bookingForm.patchValue({
          dropoffDate: dropoff,
          dropoffTime: `${String(dropoff.getHours()).padStart(2, '0')}:${String(dropoff.getMinutes()).padStart(2, '0')}`
        }, { emitEvent: false });
      }
    } else if (driveBasis === 'perDay') {
      const days = this.bookingForm.get('daysToDrive')?.value;
      if (days && days > 0) {
        const dropoff = new Date(pickup.getTime() + days * 24 * 60 * 60 * 1000);
        this.bookingForm.patchValue({
          dropoffDate: dropoff,
          dropoffTime: pickupTime
        }, { emitEvent: false });
      }
    }  else if (driveBasis === 'perKm') {
  const kms = this.bookingForm.get('kmsToDrive')?.value;

  if (!kms || kms <= 0) return;

  //  Average speed + traffic buffer
  const AVERAGE_SPEED = 30; // km/hr (city driving)
  const BUFFER_HOURS = 1;   // traffic + signals + break

  const estimatedHours = (kms / AVERAGE_SPEED) + BUFFER_HOURS;
  const estimatedMs = estimatedHours * 60 * 60 * 1000;

  const dropoff = new Date(pickup.getTime() + estimatedMs);

  this.bookingForm.patchValue({
    dropoffDate: dropoff,
    dropoffTime: `${String(dropoff.getHours()).padStart(2, '0')}:${String(dropoff.getMinutes()).padStart(2, '0')}`
  }, { emitEvent: false });
}
  }
  


  minimumBookingDurationValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pickupDate: Date | null = group.get('pickupDate')?.value;
      const pickupTime: string = group.get('pickupTime')?.value;
      const dropoffDate: Date | null = group.get('dropoffDate')?.value;
      const dropoffTime: string = group.get('dropoffTime')?.value;

      if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
        return null;
      }

      // Combine date and time to create full Date object for pickup
      const pickup = new Date(pickupDate);
      const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
      pickup.setHours(pickupHour, pickupMinute, 0, 0);

      // Combine date and time to create full Date object for dropoff
      const dropoff = new Date(dropoffDate);
      const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
      dropoff.setHours(dropoffHour, dropoffMinute, 0, 0);

      const diffInMinutes = (dropoff.getTime() - pickup.getTime()) / (1000 * 60);

      return diffInMinutes < 60 ? { minDuration: true } : null;
    };
  }

  manageDropoffControlState() {
    const driveBasis = this.bookingForm.get('driveBasis')?.value;

     if (driveBasis === 'perHour' || driveBasis === 'perDay' || driveBasis === 'perKm') {
    this.bookingForm.get('dropoffDate')?.disable({ emitEvent: false });
    this.bookingForm.get('dropoffTime')?.disable({ emitEvent: false });
  } else {
    // (future case: manual selection if ever needed)
    this.bookingForm.get('dropoffDate')?.enable({ emitEvent: false });
    this.bookingForm.get('dropoffTime')?.enable({ emitEvent: false });
  }
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
        this.selectedImage = '../../../../assets/image/imageNotAvalible.png';
      }

      // this.loadAvailableDrivers(); //  YAHI SAHI JAGAH HAI
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
     if (
    this.bookingForm.get('driveBasis')?.value === 'perKm' &&
    !this.selectedDriver
  ) {
    alert('⚠ Please select a driver for Per KM booking');
    return;
  }
    if (this.bookingForm.valid) {
      const amount = this.calculateAmountBreakup();

      const bookingData = {
        vehicleDetails: this.vehicleDetails,
        bookingFormValues: this.bookingForm.getRawValue(),
        ...amount

      };
      // console.log(bookingData);
      const bookingFormValues = this.bookingForm.getRawValue();
      this.router.navigate(['/customer-dashboard/previewPage'], {
        state: { bookingData }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }
  // When driver is selected
onDriverSelect(driver: any) {
    this.selectedDriver = driver; 
  if (this.bookingForm.valid) {
    const amount = this.calculateAmountBreakup();

    const bookingData = {
      vehicleDetails: this.vehicleDetails,
      driverDetails: driver, // Adding driver data
      bookingFormValues: this.bookingForm.getRawValue(),
      ...amount
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
    // this.loadAvailableDrivers();
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
    this.initCheckboxes();
    this.clearCheckboxes();
    this.showDriverSection = true; // Reset modal state on close
    this.showTermsSection = false;  // Terms section hidden
    this.activeTab = 'en';
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
