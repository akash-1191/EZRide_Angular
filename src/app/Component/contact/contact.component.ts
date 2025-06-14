import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyBookingComponent } from '../customers-dashboard/my-booking/my-booking.component';
import { MyServiceService } from '../../../../my-service.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contactForm!: FormGroup;
  submitted = false;
  sucessfullmsg: any;
  errormsg:any;

  constructor(private fb: FormBuilder, private http: HttpClient, private services: MyServiceService) {
    this.contactForm = this.fb.group({
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      status: ['Pending']
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }


    this.services.Contackmessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.sucessfullmsg="Message sent successfully!";
     this.contactForm.reset();
      },
      error: (err) => {
        this.errormsg='Something went wrong. Please try again.', err;
      }
    });
  }

}
