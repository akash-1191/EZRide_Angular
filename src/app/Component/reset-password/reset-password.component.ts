import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServiceService } from '../../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  token = '';
  loading = false;
  message = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: MyServiceService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(form: FormGroup) {
    return form.get('newPassword')?.value ===
           form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  submit() {
    if (this.resetForm.invalid) return;

    this.loading = true;

    const payload = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword,
      confirmPassword: this.resetForm.value.confirmPassword
    };

    this.accountService.resetPassword(payload)
      .subscribe({
        next: (res: string) => {
          this.message = res;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.message = 'Invalid or expired link';
          this.loading = false;
        }
      });
  }
}