import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-managevehicle',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './managevehicle.component.html',
  styleUrl: './managevehicle.component.css'
})
export class ManagevehicleComponent implements OnInit {

  allVehicles: any[] = [];
  bikeVehicles: any[] = [];
  carVehicles: any[] = [];
  isModalOpen: boolean = false;
  selectedVehicle: any = null;
  vehicleTypes: string = '';
  Successmessage: string = '';
  errormessage: string = '';
  currentYear: number = new Date().getFullYear();
  // selected: string[] = [];
  selectedImageModalOpen: boolean = false;
  noImagesFound: boolean = false;
  selectedImages: { imageUrl: string, vehicleImageId: number }[] = [];
  uploadedImages: any[] = [];
  errormessageinsertimage: any;
  showDeleteModal: boolean = false;
  imageToDeleteId: number | null = null;
  showVehicleDeleteModal: boolean = false;
  vehicleToDeleteId: number | null = null;
  isPriceModalOpen = false;
  selectedVehicleId: number | null = null;
  pricesList: any[] = [];
  pricesMap: { [vehicleId: number]: any } = {};


  constructor(private service: MyServiceService) { }

  ngOnInit(): void {
    this.loadPrices();
    this.getAllVehicles();
    this.fetchFirstImageForEachVehicle();
    this.vehicleForm.get('vehicleType')?.valueChanges.subscribe(value => {
      this.vehicleTypes = value;

      if (value === 'Car') {
        this.setCarValidators();
      } else if (value === 'Bike') {
        this.setBikeValidators();
      }
    });
    const initialType = this.vehicleForm.get('vehicleType')?.value;
    if (initialType === 'Car') this.setCarValidators();
    if (initialType === 'Bike') this.setBikeValidators();
  }


  // display the vehicle data
  getAllVehicles() {
    this.service.getAllVehicles().subscribe({
      next: (res) => {
        this.allVehicles = res;
        this.bikeVehicles = this.allVehicles.filter(v => v.vehicletype === 'Bike');
        this.carVehicles = this.allVehicles.filter(v => v.vehicletype === 'Car');
        this.fetchFirstImageForEachVehicle();
        this.loadPrices();
      },
      error: (err) => {

      }
    });
  }
  //  Dynamic Validator Methods
  setCarValidators() {
    this.carName.setValidators([Validators.required]);
    this.seatingCapacity.setValidators([Validators.required, Validators.min(1)]);
    this.acAvailability.setValidators([Validators.required]);

    this.bikeName.clearValidators();

    this.carName.updateValueAndValidity();
    this.seatingCapacity.updateValueAndValidity();
    this.acAvailability.updateValueAndValidity();
    this.bikeName.updateValueAndValidity();
  }

  setBikeValidators() {
    this.bikeName.setValidators([Validators.required]);

    this.carName.clearValidators();
    this.seatingCapacity.clearValidators();
    this.acAvailability.clearValidators();

    this.bikeName.updateValueAndValidity();
    this.carName.updateValueAndValidity();
    this.seatingCapacity.updateValueAndValidity();
    this.acAvailability.updateValueAndValidity();
  }

  vehicleForm: FormGroup = new FormGroup({
    vehicleId: new FormControl(null),
    vehicleType: new FormControl('', Validators.required),
    registrationNo: new FormControl('', [Validators.required]),
    availability: new FormControl('', Validators.required),
    fuelType: new FormControl('', Validators.required),
    mileage: new FormControl('', [Validators.required, Validators.min(0)]),
    color: new FormControl('', Validators.required),
    yearOfManufacture: new FormControl('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear())
    ]),
    insuranceStatus: new FormControl('', Validators.required),
    rcStatus: new FormControl('', Validators.required),
    carName: new FormControl(''),
    seatingCapacity: new FormControl(''),
    acAvailability: new FormControl(''),
    bikeName: new FormControl(''),
    engineCapacity: new FormControl('', Validators.required),
    fuelTankCapacity: new FormControl('', [Validators.required, Validators.min(0)])
  });



  updateSelectedVehicle() {
    if (!this.vehicleForm.valid) {
      this.errormessage = 'Please fill all required fields.';
      return;
    }

    const updatedData = this.vehicleForm.getRawValue();

    if (!updatedData.vehicleId) {
      this.errormessage = "Vehicle ID is missing.";
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      this.errormessage = 'Token not found. Please log in.';
      return;
    }

    const decoded: any = jwtDecode(token);
    updatedData.userId = decoded.UserId;

    // Nullify unused fields
    if (updatedData.vehicleType === 'Bike') {
      updatedData.carName = null;
      updatedData.acAvailability = null;
      updatedData.seatingCapacity = 0;
    } else if (updatedData.vehicleType === 'Car') {
      updatedData.bikeName = null;
    }
    //updaet data of the vehicle
    this.service.updateVehicle(updatedData).subscribe({
      next: (res) => {
        this.Successmessage = "Vehicle updated successfully!";
        this.getAllVehicles();
        this.closeModal();
      },
      error: (err) => {

        this.errormessage = err?.error?.message || 'Something went wrong!';
      }
    });
  }

  openModal(vehicle: any) {
    this.isModalOpen = true;
    this.selectedVehicle = vehicle;
    if (vehicle) {

      this.vehicleForm.patchValue({
        vehicleId: vehicle.vehicleId,
        vehicleType: vehicle.vehicletype,
        registrationNo: vehicle.registrationNo,
        fuelType: vehicle.fuelType,
        availability: vehicle.availability,
        color: vehicle.color,
        yearOfManufacture: vehicle.yearOfManufacture,
        insuranceStatus: vehicle.insuranceStatus,
        rcStatus: vehicle.rcStatus,
        fuelTankCapacity: vehicle.fuelTankCapacity,
        engineCapacity: vehicle.engineCapacity,
        seatingCapacity: vehicle.seatingCapacity,
        mileage: vehicle.mileage,
        bikeName: vehicle.bikeName, // For bike
        carName: vehicle.carName, // For car
        acAvailability: vehicle.acAvailability
      });

      this.vehicleTypes = vehicle.vehicletype;
    } else {
      this.vehicleForm.reset({
        vehicleType: 'Car',
      });
    }
  }


  // delete data of the vehicle
  deleteVehicle(vehicleId: number) {
    this.vehicleToDeleteId = vehicleId;
    this.showVehicleDeleteModal = true;
  }

  confirmVehicleDelete() {
    if (this.vehicleToDeleteId !== null) {
      this.service.deleteVehicle(this.vehicleToDeleteId).subscribe({
        next: (res) => {
          this.Successmessage = 'Vehicle deleted successfully!';
          this.getAllVehicles(); // refresh vehicle list
          this.closeVehicleModal();
        },
        error: (err) => {
          this.errormessage = err?.error?.message || 'Failed to delete vehicle.';
          this.closeVehicleModal();
        }
      });
    }
  }

  closeVehicleModal() {
    this.showVehicleDeleteModal = false;
    this.vehicleToDeleteId = null;
  }

  //  Form Control Getters
  get vehicleType(): FormControl { return this.vehicleForm.get('vehicleType') as FormControl; }
  get registrationNo(): FormControl { return this.vehicleForm.get('registrationNo') as FormControl; }
  get availability(): FormControl { return this.vehicleForm.get('availability') as FormControl; }
  get fuelType(): FormControl { return this.vehicleForm.get('fuelType') as FormControl; }
  get mileage(): FormControl { return this.vehicleForm.get('mileage') as FormControl; }
  get color(): FormControl { return this.vehicleForm.get('color') as FormControl; }
  get yearOfManufacture(): FormControl { return this.vehicleForm.get('yearOfManufacture') as FormControl; }
  get insuranceStatus(): FormControl { return this.vehicleForm.get('insuranceStatus') as FormControl; }
  get rcStatus(): FormControl { return this.vehicleForm.get('rcStatus') as FormControl; }
  get carName(): FormControl { return this.vehicleForm.get('carName') as FormControl; }
  get seatingCapacity(): FormControl { return this.vehicleForm.get('seatingCapacity') as FormControl; }
  get acAvailability(): FormControl { return this.vehicleForm.get('acAvailability') as FormControl; }
  get bikeName(): FormControl { return this.vehicleForm.get('bikeName') as FormControl; }
  get engineCapacity(): FormControl { return this.vehicleForm.get('engineCapacity') as FormControl; }
  get fuelTankCapacity(): FormControl { return this.vehicleForm.get('fuelTankCapacity') as FormControl; }

  closeModal() {
    this.isModalOpen = false;
    this.vehicleForm.reset();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
      this.closeImageModal();
      this.closeVehicleModal();
      this.closeDeleteModalImage();
      this.closesetpricemodal();
    }
  }

  // featch image asho show the image in the table row
  vehicleImages: { [key: number]: string } = {};
  fetchFirstImageForEachVehicle(): void {
    this.allVehicles.forEach((vehicle: any) => {
      this.service.getVehicleImages(vehicle.vehicleId).subscribe(
        (images: any[]) => {
          if (images.length > 0) {
            this.vehicleImages[vehicle.vehicleId] = 'http://localhost:7188/' + images[0].imagePath;

          }
        },
        // error => console.error(`Error fetching images for vehicle ID ${vehicle.id}:`, error)
      );
    });
  }

  // select image in the modal
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    const vehicleId = this.selectedVehicle;

    if (!file || !vehicleId) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImages.push({
        imageUrl: reader.result as string,
        vehicleImageId: 0
      });
    };
    reader.readAsDataURL(file);

    // Upload API Call (insert image)
    this.service.uploadVehicleImage(vehicleId, file).subscribe({
      next: (res) => {
        this.refreshModalImages(vehicleId);
      },
      error: (err) => {
        this.errormessageinsertimage = 'Image upload failed.';
      }
    });
  }

  //refress modal 
  refreshModalImages(vehicleId: number): void {
    const baseUrl = "http://localhost:7188/";

    this.service.getVehicleImages(vehicleId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.selectedImages = response.map((img: any) => ({

            imageUrl: baseUrl + img.imagePath,
            vehicleImageId: img.vehicleImageId

          }));
          
          this.noImagesFound = false;
        } else {
          this.selectedImages = [];
          this.noImagesFound = true;
        }
      },
      (error) => {
        this.selectedImages = [];
        this.noImagesFound = true;
      }
    );
  }


  // delete the image data
  deleteVehicleImage(vehicleImageId: number) {
    this.imageToDeleteId = vehicleImageId;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.imageToDeleteId !== null) {
      this.service.deleteVehicleImage(this.imageToDeleteId).subscribe({
        next: (res) => {
          this.Successmessage = 'Vehicle deleted successfully!';
          this.selectedImages = this.selectedImages.filter(img => {
            if (typeof img === 'string') return true;
            return img.vehicleImageId !== this.imageToDeleteId;
          });
          this.closeDeleteModalImage();
        },
        error: (err) => {
          this.errormessage = err?.error?.message || 'Failed to delete vehicle.';
          this.closeDeleteModalImage();
        }
      });
    }
  }
  // close the modal to delete of the image
  closeDeleteModalImage() {
    this.showDeleteModal = false;
    this.imageToDeleteId = null;
  }
  // canceldeleto image 
  cancelDelete() {
    this.closeDeleteModalImage();
  }


  // upload image in the perticulr vehicleid 

  openImageModal(vehicleId: number) {
    const baseUrl = "http://localhost:7188/";

    this.selectedVehicle = vehicleId;

    this.service.getVehicleImages(vehicleId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          // Image ka pura path banao
          this.selectedImages = response.map((img: any) => ({
            imageUrl: baseUrl + img.imagePath,
            vehicleImageId: img.vehicleImageId
          }));

          this.noImagesFound = false;
        } else {
          this.selectedImages = [];
          this.noImagesFound = true;
        }
        this.selectedImageModalOpen = true;
        this.selectedVehicle = vehicleId;
      },
      (error) => {

        this.selectedImages = [];
        this.noImagesFound = true;
        this.selectedImageModalOpen = true;
      }
    );
  }

  closeImageModal() {
    this.selectedImageModalOpen = false;
    this.selectedImages = [];
    this.noImagesFound = false;
    this.ngOnInit();
  }

  // Reactive form declaration for price form
  priceForm: FormGroup = new FormGroup({
    priceType: new FormControl('', Validators.required),
    priceAmount: new FormControl('', [Validators.required, Validators.min(1)])
  });

  // Getters for easy access and validation checks in template 
  get priceType(): FormControl { return this.priceForm.get('priceType') as FormControl; }
  get priceAmount(): FormControl { return this.priceForm.get('priceAmount') as FormControl; }


  // set price open modal
  setpriceopenmodal(vehicleId: number) {
    this.selectedVehicleId = vehicleId;
    this.priceForm.reset();
    this.isPriceModalOpen = true;
  }

  closesetpricemodal() {
    this.isPriceModalOpen = false;
    this.loadPrices();
    this.Successmessage = '';
    this.errormessage = '';
  }

  submitPrice() {
    if (this.priceForm.invalid) {
      this.priceForm.markAllAsTouched();
      return;
    }
    if (!this.selectedVehicleId) {
      this.errormessage = 'Vehicle ID not found!';
      return;
    }
    const data = {
      vehicleId: this.selectedVehicleId,
      priceType: this.priceType.value,
      price: this.priceAmount.value
    };

    this.service.insertOrUpdatePricing(data).subscribe({
      next: (res) => {
        this.Successmessage = 'Price set successfully!';
      },
      error: (err) => {
        this.errormessage = 'Error setting price!';
       
      }
    });
  }
  // get price data 
  loadPrices() {
    this.pricesMap = {};
    this.allVehicles.forEach((vehicle: any) => {
      this.service.getPricingByVehicleId(vehicle.vehicleId).subscribe({
        next: (res) => {
          if (res && res.isSuccess && res.data) {
            this.pricesMap[vehicle.vehicleId] = res.data;
          } else {
            this.pricesMap[vehicle.vehicleId] = null;
          }
        },
        error: (err) => {
          console.error(`Error loading price for vehicleId ${vehicle.vehicleId}`, err);
        }
      });
    });
  }


}
