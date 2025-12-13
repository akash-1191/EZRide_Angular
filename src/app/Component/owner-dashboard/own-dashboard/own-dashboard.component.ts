import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MyServiceService } from '../../../../../my-service.service';

@Component({
  selector: 'app-own-dashboard',
  imports: [RouterLink],
  templateUrl: './own-dashboard.component.html',
  styleUrl: './own-dashboard.component.css'
})
export class OwnDashboardComponent implements OnInit {


  dashboard: any;
  constructor(private services: MyServiceService) { }

  ngOnInit(): void {
    this.getdata();
  }
  getdata(): void {
    this.services.getSummaryOfTheOwnerDashboard().subscribe({
      next: (value) => {
        this.dashboard = value;
        console.log(value);
      }, error: (err) => {
        console.log(err)
      },
    })
  }

}
