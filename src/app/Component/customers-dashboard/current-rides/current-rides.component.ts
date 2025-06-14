import { Component } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-rides',
  imports: [CommonModule],
  templateUrl: './current-rides.component.html',
  styleUrl: './current-rides.component.css'
})
export class CurrentRidesComponent {

 cancelData:any;
  
  constructor(private services:MyServiceService){}

  ngOnInit(): void {
      this.loadCancelData();
  }

  loadCancelData():void{
    this.services.getCurrentRide().subscribe({
      next  :(res)=>{
      
          this.cancelData = res.data; 
        console.log("cancel data is the ",res);
      },error:()=>{
        console.log("Somthig went to wrong!");
      }
    })
  }

}
