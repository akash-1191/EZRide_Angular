import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service',
  imports: [],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent implements OnInit {


constructor(private router:Router){}


OnclickRdirectPage(){
  this.router.navigate(["/about"])
}


  ngOnInit(){
    console.log("ngInit call frist");
  }


}
