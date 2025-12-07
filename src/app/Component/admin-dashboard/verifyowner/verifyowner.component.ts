import { Component, HostListener, OnInit } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-verifyowner',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './verifyowner.component.html',
  styleUrl: './verifyowner.component.css'
})
export class VerifyownerComponent implements OnInit {

  // =======================
  // VARIABLES
  // =======================
  allOwners: any[] = [];
  filteredOwners: any[] = [];
  loading: boolean = false;

  selectedFilter: string = ""; // All / Active / Disabled / Pending

  // View Modal
  showViewModal: boolean = false;
  selectedOwner: any = null;

  // Reject Modal
  showRejectModal: boolean = false;
  rejectionReason: string = "";
  selectedOwnerId: number | null = null;
errormessage:String="";
  // Pagination
  currentPage: number = 1;



  constructor(private ownerService: MyServiceService) { }

  ngOnInit(): void {
    this.getAllOwners();
  }

  // =======================
  // GET ALL OWNERS
  // =======================
  getAllOwners() {
    this.loading = true;

    this.ownerService.getallownervehicle().subscribe({
      next: (res) => {
        this.allOwners = res?.data || res;

        this.filteredOwners = [...this.allOwners];
        this.loading = false;
        console.log("Fetched Owners:", this.allOwners);
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error while fetching owners:", err);
        this.loading = false;
      }
    });

  }

  // =======================
  // FILTER OWNERS
  // =======================
  applyFilter() {
    if (this.selectedFilter === "") {
      this.filteredOwners = this.allOwners;
    } else {
      this.filteredOwners = this.allOwners.filter(o =>
        o.status?.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }
  }

  // =======================
  // OPEN VIEW MODAL
  // =======================
  openViewModal(owner: any) {
    this.selectedOwner = owner;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOwner = null;
  }

  // =======================
  // APPROVE OWNER
  // =======================
  approveOwner(ownerId: number) {
    this.ownerService.approveOwner(ownerId).subscribe({
      next: () => {
        this.getAllOwners();
      },
      error: (err) => console.log("Approve Error:", err)
    });

  }

  // =======================
  // OPEN REJECT MODAL
  // =======================
  openRejectModal(ownerId: number) {
    this.selectedOwnerId = ownerId;
    this.rejectionReason = "";
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedOwnerId = null;
  }

  // =======================
  // REJECT OWNER
  // =======================
  rejectOwner() {
    if (!this.selectedOwnerId) return;

    if (!this.rejectionReason.trim()) {
      this.errormessage="Please enter rejection reason!";
      return;
    }

    this.ownerService.rejectOwner(this.selectedOwnerId, this.rejectionReason).subscribe({
      next: () => {
        this.errormessage="Owner Rejected Successfully!";
        this.showRejectModal = false;
        this.getAllOwners();
      },
      error: (err) => console.log("Reject Error:", err)
    });
  }

    @HostListener('document:keydown.escape', ['$event'])
  onEscPress(event: any) {
    this.closeAllModals();
  }

  closeAllModals() {
    this.showViewModal = false;
    this.showRejectModal = false;
    this.selectedOwner = null;
    this.selectedOwnerId = null;
    this.rejectionReason = '';
    this.errormessage = '';
  }
}
