import { Component, HostListener } from '@angular/core';
import { MyServiceService } from '../../../../../my-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verified-driver',
  imports: [FormsModule, CommonModule],
  templateUrl: './verified-driver.component.html',
  styleUrl: './verified-driver.component.css'
})
export class VerifiedDriverComponent {




  constructor(private services: MyServiceService) { }


  drivers: any[] = [];

  isViewModalOpen = false;
  isRejectModalOpen = false;
  isImagePreviewOpen = false;

  selectedDriver: any = null;

  rejectReason = '';
  rejectUserId: number | null = null;

  previewImageUrl = '';
  successMessage: string = '';
  errorMessage: string = '';

  approvedDrivers: any[] = [];
  rejectedDrivers: any[] = [];
 

  ngOnInit() {
    this.loadDrivers();
  }

  /* LOAD DRIVERS */
  loadDrivers() {
    this.services.GetAllDriverDetials().subscribe({
      next: (res) => {
        this.drivers = res.data || [];
        this.approvedDrivers = this.drivers.filter(driver => driver.userStatus === 'Active');
        this.rejectedDrivers = this.drivers.filter(driver => driver.userStatus === 'Disabled');
      },
      error: () => {
        this.showError('Failed to load drivers');
      }
    });
  }

  /* ================= VIEW ================= */
  openViewModal(driver: any) {
    this.selectedDriver = driver;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedDriver = null;
  }

  /* ================= PDF ================= */
  openPdf(path: string) {
    window.open('http://localhost:7188/' + path, '_blank');
  }

  /* ================= IMAGE PREVIEW ================= */
  openImagePreview(path: string) {
    this.previewImageUrl = 'http://localhost:7188/' + path;
    this.isImagePreviewOpen = true;
  }

  closeImagePreview() {
    this.isImagePreviewOpen = false;
    this.previewImageUrl = '';
  }

  /* ================= APPROVE ================= */
  approveDriver(driver: any) {
    console.log('Driver object:', driver);
    // console.log('BEFORE:', driver.status);

    this.services.approveDriver(driver.userId).subscribe({
      next: () => {
        this.showSuccess('Driver approved successfully');
        //  console.log('AFTER:', driver.status);
        this.loadDrivers();
      },
      error: () => {
        this.showError('Driver approval failed');
      }
    });
  }


  /* ================= REJECT ================= */
  openRejectModal(driver: any) {
    this.rejectUserId = driver.userId;
    this.rejectReason = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.rejectUserId = null;
  }

  submitReject() {
    if (!this.rejectReason.trim()) {
      this.showError('Rejection reason is required');
      return;
    }

    this.services.rejectDriver(this.rejectUserId!, this.rejectReason).subscribe({
      next: () => {
        this.showSuccess('Driver rejected successfully');
        this.closeRejectModal();
        this.loadDrivers();
      }, error: () => {
        this.showError('Driver rejection failed');
      }
    });
  }



  showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showError(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';

    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: any) {
    this.closeImagePreview();
    this.closeRejectModal();
    this.closeImagePreview();
    this.closeViewModal()
  }
}

