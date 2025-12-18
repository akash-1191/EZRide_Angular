import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyServiceService } from '../../../../my-service.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {


  forgotForm: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private accountService: MyServiceService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.message = '';

    this.accountService.forgotPassword(this.forgotForm.value.email)
      .subscribe({
        next: (res: string) => {
          this.message = res; // 👈 backend ka exact message
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.message = 'Something went wrong';
          this.loading = false;
        }
      });
  }
}
