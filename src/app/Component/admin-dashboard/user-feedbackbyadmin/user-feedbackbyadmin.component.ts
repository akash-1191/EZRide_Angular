import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-feedbackbyadmin',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './user-feedbackbyadmin.component.html',
  styleUrl: './user-feedbackbyadmin.component.css'
})
export class UserFeedbackbyadminComponent implements OnInit {

  currentPage: number = 1;
  Contactdetails: any[] = [];
  responseMessage: string = '';
   phone: string = '';
  message: string = '';
  showForm: boolean = false;
  selectedType: string = '';
  messageTypes: string[] = [];
  isSending: boolean = false;


  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.loadContactData();
  }

  loadContactData(): void {
    this.services.getallfeedbackmessage().subscribe({
      next: (res) => {
        this.Contactdetails = res;

        this.messageTypes = [...new Set(res.map((msg: any) => msg.feedbackType))] as string[];

      },
      error: (err) => {
        console.log("Something went wrong", err);
      }
    });
  }

  filteredMessages(): any[] {
    if (!this.selectedType) return this.Contactdetails;
    return this.Contactdetails.filter((msg: any) => msg.feedbackType === this.selectedType);
  }

  openWhatsAppForm(phone: string) {
    this.phone = phone;
    this.message = '';
    this.responseMessage = '';
    this.showForm = true;
  }


  closeForm() {
    this.showForm = false;
    this.phone = '';
    this.message = '';
    this.responseMessage = '';
  }
  sendMessage() { 
    if (!this.phone || !this.message.trim()) {
      this.responseMessage = 'Please enter both phone number and message.';
      return;
    }

    if (this.message.trim().length < 10) {
      this.responseMessage = 'Message must be at least 10 characters long.';
      return;
    }

    let formattedPhone = this.phone.startsWith('+') ? this.phone : '91' + this.phone;


    this.isSending = true;

    this.services.sendMessage(formattedPhone, this.message).subscribe({
      next: (res) => {
        console.log(res);
        this.responseMessage = ' Message sent successfully!';
        this.isSending = false;
        setTimeout(() => this.closeForm(), 2000);
      },
      error: (err) => {
        console.error(err);
        this.responseMessage = ' Something went wrong. Try again later.';
        this.isSending = false;
      }
    });
  }

}
