import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MyServiceService } from '../../../../my-service.service';



@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent {

  private router = inject(Router);
  public someerror: string = '';
  public Matchpassword: string = '';
  selectedFile: File | null = null;


  LoginPage() {
    this.router.navigate(['/login']);
  }

  constructor(private services: MyServiceService) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  Signup() {

    if (this.SignupForm.invalid) {
      alert("⚠ Form is invalid, please fill all required fields!");
      return;
    }

    if (this.SignupForm.get('Cpass')?.touched && this.SignupForm.value.Pass !== this.SignupForm.value.Cpass) {
      this.Matchpassword = "Password and Confirm Password do not match!";
      return;
    } else {
      this.Matchpassword = ''
    }

    this.someerror = '';


    const formData = new FormData();
    formData.append('FirstName', this.SignupForm.value.FristName);
    formData.append('MiddleName', this.SignupForm.value.MiddleName);
    formData.append('LastName', this.SignupForm.value.LastName);
    formData.append('Email', this.SignupForm.value.Email);
    formData.append('Phone', this.SignupForm.value.Phone_No);
    formData.append('Password', this.SignupForm.value.Pass);
    formData.append('Address', this.SignupForm.value.Address);
    formData.append('Age', this.SignupForm.value.Age);
    formData.append('Gender', this.SignupForm.value.Gender);
    formData.append('City', this.SignupForm.value.city);
    formData.append('State', this.SignupForm.value.State);
    formData.append('RoleId', this.SignupForm.value.Role === "Owner_Vehicle" ? '2' : '3');

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }


    this.services.postdat(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Signup error:", error);

        if (error.status === 400 || error.status === 409 || error.status === 422) {
          this.someerror = error.error.message || "Something went wrong.";
        }
        else if (error.status === 0) {
          alert("⚠ Server is not running or unreachable! Please try again later.");
        }
        else {
          alert("⚠ An unexpected error occurred. Please try again later.");
        }
      }
    });   
  }


  SignupForm: FormGroup = new FormGroup({
    Role: new FormControl("", [Validators.required]),
    FristName: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z]*")]),
    MiddleName: new FormControl("", [Validators.pattern("[a-zA-Z]*")]),
    LastName: new FormControl("", [Validators.required, Validators.pattern("[A-Za-z]*")]),
    Age: new FormControl("", [Validators.required, Validators.pattern("[0-9]*")]),
    Gender: new FormControl("", [Validators.required]),
    Phone_No: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*")]),
    State: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    Email: new FormControl("", [Validators.required, Validators.email]),
    Profile_Picture: new FormControl("", [Validators.required]),
    Address: new FormControl("", [Validators.required]),
    Pass: new FormControl("", [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$")]),
    Cpass: new FormControl("", [Validators.required])
  });



  get Role(): FormControl { return this.SignupForm.get("Role") as FormControl; }
  get FristName(): FormControl { return this.SignupForm.get("FristName") as FormControl; }
  get MiddleName(): FormControl { return this.SignupForm.get("MiddleName") as FormControl; }
  get LastName(): FormControl { return this.SignupForm.get("LastName") as FormControl; }
  get Age(): FormControl { return this.SignupForm.get("Age") as FormControl; }
  get Gender(): FormControl { return this.SignupForm.get("Gender") as FormControl; }
  get Phone_No(): FormControl { return this.SignupForm.get("Phone_No") as FormControl; }
  get State(): FormControl { return this.SignupForm.get("State") as FormControl; }
  get city(): FormControl { return this.SignupForm.get("city") as FormControl; }
  get Email(): FormControl { return this.SignupForm.get("Email") as FormControl; }
  get Profile_Picture(): FormControl { return this.SignupForm.get("Profile_Picture") as FormControl; }
  get Address(): FormControl { return this.SignupForm.get("Address") as FormControl; }
  get Pass(): FormControl { return this.SignupForm.get("Pass") as FormControl; }
  get Cpass(): FormControl { return this.SignupForm.get("Cpass") as FormControl; }
}

