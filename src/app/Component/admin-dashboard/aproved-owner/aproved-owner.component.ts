import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aproved-owner',
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './aproved-owner.component.html',
  styleUrl: './aproved-owner.component.css'
})
export class AprovedOwnerComponent implements OnInit {


  allOwners: any[] = [];
 
  // View Modal
  showViewModal: boolean = false;
  selectedOwner: any = null;
  // Pagination
  currentPage: number = 1;

  constructor(private ownerService: MyServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getAllOwners();
  }

  getAllOwners() {
 
    this.ownerService.getallActiveownervehicle().subscribe({
      next: (res) => {
        this.allOwners = res?.data || res;
        console.log("Fetched Owners:", this.allOwners);
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error while fetching owners:", err);
      }
    });
  }

   goToOwnerDetails(ownerId: number) {
    this.router.navigate(['/admin-dashboard/set-rents', ownerId]);
  }

}