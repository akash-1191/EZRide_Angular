import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rejected-bookings',
  imports: [CommonModule],
  templateUrl: './rejected-bookings.component.html',
  styleUrl: './rejected-bookings.component.css'
})
export class RejectedBookingsComponent implements OnInit {

  cancelData:any;
  
  constructor(private services:MyServiceService){}

  ngOnInit(): void {
      this.loadCancelData();
  }

  loadCancelData():void{
    this.services.getallCancelResion().subscribe({
      next:(res)=>{
        this.cancelData=res;
        console.log("cancel data is the ",res);
      },error:()=>{
        console.log("Somthig went to wrong!");
      }
    })
  }

}
