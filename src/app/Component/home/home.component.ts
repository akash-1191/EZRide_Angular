import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {
title="Welcome TO Home Page"

constructor(){}
 

changeTitle(){
  this.title="Change Home Page Content";
}


ngOnInit(){
console.log("ngOnInit Call")
}


}
