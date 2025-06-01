import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../../../../my-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  roleError: string | null = null;
  isLoading: boolean = false;
  showPassword = false;

  constructor(private loginservices: MyServiceService) { }

  LoginForm: FormGroup = new FormGroup({
    Email: new FormControl("", [Validators.required, Validators.email]),
    Password: new FormControl("", [Validators.required])
  });

  // Getter methods for FormControls
  get Email(): FormControl { return this.LoginForm.get('Email') as FormControl; }
  get Password(): FormControl { return this.LoginForm.get('Password') as FormControl; }



  ngOnInit(): void {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("Role");

    // If token and role exist, automatically redirect the user to their respective dashboard
    if (token && role) {
      this.redirectBasedOnRole(role);
    }

  }

  SignUpPage() {
    this.router.navigate(['/signup']);
  }

  Login(): void {
    if (this.LoginForm.invalid) {
      this.isLoading = false;
      this.roleError = "Please fill in all required fields.";
      return;
    }
    this.isLoading = true;
    this.roleError = null;

    const loginobj = {
      email: this.Email.value,
      password: this.Password.value
    };

    // Call the login service
    this.loginservices.LoginpostData(loginobj).subscribe(
      (res: any) => {
        const token = res.data.token;
        const roleName = res.data.user.roleName;

        // Save token and role to sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("Role", roleName);

        this.isLoading = false;
        this.redirectBasedOnRole(roleName);

      },
      (error: HttpErrorResponse) => {
        // Handle different error responses
        if (error.status === 401 || error.status === 400) {
          this.roleError = error.error.message;
          this.isLoading = false;
        } else if (error.status === 500) {
          this.roleError = error.error.message || "An error occurred. Please try again.";
          this.isLoading = false;
        } else {
          this.roleError = "⚠ Server is not running! Please try again later.";
          this.isLoading = false;
        }
      }
    );
  }

  // Helper method to handle role-based redirection
  private redirectBasedOnRole(role: string): void {
    if (role === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'OwnerVehicle') {
      this.router.navigate(['/OwnerVehicle-dashboard']);
    } else if (role === 'Customer') {
      this.router.navigate(['/customer-dashboard']);
    } else {
      this.roleError = "Something went wrong! Unknown role.";
    }
  }


}
