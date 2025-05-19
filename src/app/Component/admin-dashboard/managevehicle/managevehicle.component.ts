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


  constructor(private service: MyServiceService) { }

  ngOnInit(): void {
    this.getAllVehicles();
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


  getAllVehicles() {
    this.service.getAllVehicles().subscribe({
      next: (res) => {
        this.allVehicles = res;
        this.bikeVehicles = this.allVehicles.filter(v => v.vehicletype === 'Bike');
        this.carVehicles = this.allVehicles.filter(v => v.vehicletype === 'Car');
      },
      error: (err) => {
        console.error("Error fetching vehicles", err);
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

    const token = localStorage.getItem('token');
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

    this.service.updateVehicle(updatedData).subscribe({
      next: (res) => {
        this.Successmessage = "Vehicle updated successfully!";
        this.getAllVehicles();
        this.closeModal();
      },
      error: (err) => {
        console.error("Update failed:", err);
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

  deleteVehicle(vehicleId: number) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.service.deleteVehicle(vehicleId).subscribe({
        next: (res) => {
          this.Successmessage = 'Vehicle deleted successfully!';
          this.getAllVehicles(); 
        },
        error: (err) => {
          console.error('Error deleting vehicle', err);
          this.errormessage = err?.error?.message || 'Failed to delete vehicle.';
        }
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.vehicleForm.reset();
  }
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
