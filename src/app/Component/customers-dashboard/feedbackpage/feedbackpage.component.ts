import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-feedbackpage',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './feedbackpage.component.html',
  styleUrl: './feedbackpage.component.css'
})
export class FeedbackpageComponent {
  feedbackForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = '';
  submitError = '';
  userId: any;

  feedbackTypes = [
    { value: 'Complaint', display: 'Complaint' },
    { value: 'Suggestion', display: 'Suggestion' },
    { value: 'Review', display: 'Review' }
  ];

  constructor(private fb: FormBuilder, private feedbackService: MyServiceService) { }

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      feedbackType: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    this.submitSuccess = '';
    this.submitError = '';

    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.UserId || decodedToken.userId;
    }

    this.isSubmitting = true;

    const feedback: any = {
      userId: this.userId,
      feedbackType: this.feedbackForm.value.feedbackType,
      message: this.feedbackForm.value.message,

    };

    this.feedbackService.addFeedback(feedback).subscribe({
      next: (res) => {

        this.isSubmitting = false;
        this.submitSuccess = 'Thank you for your feedback!';
        this.feedbackForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to send feedback. Please try again later.';
        console.error(err);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.feedbackForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}