import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-a-addvehicle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './a-addvehicle.component.html',
  styleUrl: './a-addvehicle.component.css'
})
export class AAddvehicleComponent implements OnInit {

  constructor(private services: MyServiceService) { }

  vehicleTypes: string = '';
  Successmessage:string='';
  errormessage: string = '';
  currentYear: number = new Date().getFullYear();

  vehicleForm: FormGroup = new FormGroup({
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

  ngOnInit(): void {
    this.vehicleForm.get('vehicleType')?.valueChanges.subscribe(value => {
      this.vehicleTypes = value;

      if (value === 'Car') {
        this.setCarValidators();
      } else if (value === 'Bike') {
        this.setBikeValidators();
      }
    });

    // Handle default (initial) value if any
    const initialType = this.vehicleForm.get('vehicleType')?.value;
    if (initialType === 'Car') this.setCarValidators();
    if (initialType === 'Bike') this.setBikeValidators();
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

  submitForm() {
    if (this.vehicleForm.valid) {
      const vehicleData = this.vehicleForm.getRawValue();

      const token = sessionStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.UserId;
        vehicleData.userId = userId;
      } else {
        console.error('Token not found!');
        this.errormessage = 'Token not found. Please log in again.';
        return;
      }

      if (vehicleData.vehicleType === 'Bike') {
        vehicleData.carName = null;
        vehicleData.seatingCapacity = 0;
        vehicleData.acAvailability = null;
      } else if (vehicleData.vehicleType === 'Car') {
        vehicleData.bikeName = null;
      }

      // Call the service to add the vehicle
      this.services.addVehicle(vehicleData).subscribe({
        next: (res) => {
          this.Successmessage = 'Vehicle added successfully! Please check Manage Vehicles Section';
          this.vehicleForm.reset();
        },
        error: (err) => {
          this.errormessage = 'Something went wrong!';
        }
      });
    } else {
      this.errormessage='Form is invalid!';
      this.vehicleForm.markAllAsTouched();
    }
  }
}
