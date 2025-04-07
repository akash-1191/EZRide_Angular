import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../../../../my-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  private router = inject(Router);

  SignUpPage() {
    this.router.navigate(['/signup']);
  }

  constructor(private loginservices: MyServiceService) { }


  LoginForm: FormGroup = new FormGroup({
    Email: new FormControl("", [Validators.required, Validators.email]),
    Password: new FormControl("", [Validators.required])
  });

  get Email(): FormControl { return this.LoginForm.get('Email') as FormControl; }
  get Password(): FormControl { return this.LoginForm.get('Password') as FormControl; }


  Login() {
    const loginobj = {
      "email": this.LoginForm.value.Email,
      "password": this.LoginForm.value.Password
    }

    this.loginservices.LoginpostData(loginobj).subscribe(
      (res: any) => {
        // alert("Login Success full");
        this.router.navigate(['/user-dashboard']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert("Incorrect username or password");
        } else if (error.status === 500) {
          alert("An error occurred. Please try again.");
        } else {
          alert("⚠ Server is not running! Please try again later.");
        }
      }
    );
  }
}
