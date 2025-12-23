import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from './src/environments/environment';
// import { DateAvailabilityDTO } from './date-availability.model';

export interface AvailabilitySlot {
  startDateTime: string;
  endDateTime: string;
  isAvailable: boolean;
}
@Injectable({
  providedIn: 'root'
})

export class MyServiceService {

  private baseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) { }




  private getAuthHeaders(isJson: boolean = false): HttpHeaders {
    const token = sessionStorage.getItem('token');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (isJson) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }


  // =======================
  // Auth APIs
  // =======================
  postdat(obj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Signup`, obj);
  }
  LoginpostData(obj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Login`, obj);
  }



  // =======================
  // Profile APIs
  // =======================
  UserProfiledata(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Profile/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  UpdateUserData(updateData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-profile`,
      updateData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  updateUserImage(formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-profile-image`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // =======================
  // Vehicle APIs
  // =======================
  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/addVehicle`,
      vehicleData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  getAllVehicles(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getAllVehicles`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  updateVehicle(vehicleData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/updateVehicle`,
      vehicleData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  deleteVehicle(vehicleId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/deleteVehicle/${vehicleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // =======================
  // Vehicle Images
  // =======================
  uploadVehicleImage(vehicleId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('VehicleId', vehicleId.toString());
    formData.append('ImageFile', imageFile);

    return this.http.post<any>(
      `${this.baseUrl}/uploadVehicleImage`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  getVehicleImages(vehicleId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getImagesByVehicle/${vehicleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete Vehicle Image
  deleteVehicleImage(vehicleImageId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/deleteVehicleImage/${vehicleImageId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Insert or Update Pricing
  insertOrUpdatePricing(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/set-Or-price`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get Pricing by Vehicle ID
  getPricingByVehicleId(vehicleId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get-by-vehicle/${vehicleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get all vehicles with price & images
  getAllVehiclesdetails(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/GetAllVehicle`
    );
  }

  // Owner Vehicle Availability
  getAllVehiclesFTheOwnerVehicle(vehicleId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/VehicleAvailability/availabilityOwnerVehicle/${vehicleId}`
    );
  }

  // Get Vehicle Details by ID
  getVehicleDetailsById(vehicleId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetAllVehicleById/${vehicleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Confirm Booking
  confirmBooking(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Booking/addbooking`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get All Bookings (User)
  getAllBookings(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Booking/my-bookings`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Cancel Booking
  cancelBooking(bookingId: number, userId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/Booking/cancelbooking/${bookingId}?userId=${userId}`,
      {},
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Create Razorpay Order
  createOrder(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Payment/CreateOrder`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Verify & Save Payment
  verifyAndSavePayment(payment: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Payment/VerifyPayment`,
      payment,
      { headers: this.getAuthHeaders() }
    );
  }

  // Booking Filter
  getFilteredBookings(filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Booking/my-bookings/filter`,
      filter,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Add Security Deposit
  addSecurityDeposit(depositData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/addSecurityDepositPayment`,
      depositData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Get Security Deposit by User
  getSecurityDepositsByUser(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/SecurityDeposit/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Upload Customer Documents
  uploadDocuments(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/uploadCustomerDocument`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Check Documents Uploaded
  checkDocumentsUploaded(userId: number): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.baseUrl}/checkDocumentsUploaded/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get Customer Documents
  getCustomerDocument(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getCustomerDocument/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update Document Field to NULL
  updateUserDocumentFieldToNull(userId: number, fieldName: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/update-document-field-null/${userId}/${fieldName}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Get payment status
  paymentStatusDetails(userId: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/user-PaymentDetails/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Check vehicle availability by date
  getAvailability(
    vehicleId: number,
    startDateTime: string,
    endDateTime: string
  ): Observable<AvailabilitySlot[]> {

    const params = new HttpParams()
      .set('vehicleId', vehicleId.toString())
      .set('startDateTime', startDateTime)
      .set('endDateTime', endDateTime);

    return this.http.get<AvailabilitySlot[]>(
      `${this.baseUrl}/Booking/availability`,
      { params }
    );
  }

  // Download receipt PDF
  downloadReceipt(userId: number, bookingId: number) {
    return this.http.get(
      `${this.baseUrl}/PaymentReceipt/download/${userId}/${bookingId}`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }

  // Send receipt PDF to email
  sendReceiptEmail(userId: number, bookingId: number, email: string) {
    return this.http.post(
      `${this.baseUrl}/PaymentReceipt/send-email?userId=${userId}&bookingId=${bookingId}`,
      JSON.stringify(email),
      {
        headers: this.getAuthHeaders(true),
        responseType: 'text' as 'json'
      }
    );
  }

  // Add feedback
  addFeedback(feedback: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Feedback/addFeedbackmsg`,
      feedback,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Total bookings count by user
  TotalBookingsCount(userId: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/BookingSummary/total-bookings/${userId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Total booked vehicle count by type
  TatolVehicleBookingCount(userId: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/BookingSummary/booked-vehicle-type-count/${userId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Total available vehicle count
  TatolAvalibleVehicleCount(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/BookingSummary/available-vehicle-count`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Pending payment amount
  pandingAmount(userId: number): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/BookingSummary/pending-payment-count/${userId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Last refunded amount
  LastRefendedamount(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/BookingSummary/latest-refund/${userId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Contact form submit
  Contackmessage(obj: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Contact/add`,
      obj
    );
  }

  // Load all contact messages
  contactMessageLoad(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Contact/allContactDetails`
    );
  }
  // Send WhatsApp message
  sendMessage(phone: string, message: string): Observable<any> {
    const body = { phone, message };

    return this.http.post<any>(
      `${this.baseUrl}/WhatsApp/sendWhatsAppMessage`,
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  // Admin – all users booking info
  getAllDataOftheUser(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/user-booking-info`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Admin – security refund data
  getAllSecurityrefaund(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/ReturnSecurityAmount`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Admin – all damage charges
  getAlldamagecharges(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/ShowDamageChargi`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Cancel reasons list
  getallCancelResion(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/CancelledBookings`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Current ride list
  getCurrentRide(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/bookings/inprogressStatus`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update cancel reason (Admin)
  updateCancelReason(bookingId: number, cancelReason: string): Observable<any> {
    const body = {
      BookingId: bookingId,
      Cancelreasion: cancelReason
    };

    return this.http.put<any>(
      `${this.baseUrl}/cancel-reason`,
      body,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Set booking to in-progress
  setInProgress(bookingId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/status/inprogress`,
      { bookingId },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Send OTP
  sendOtp(bookingId: number, AdminEmail: string): Observable<any> {
    const body = {
      bookingId,
      adminEmail: AdminEmail
    };

    return this.http.post<any>(
      `${this.baseUrl}/StatusChangewithOTP/send-otp`,
      body,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Verify OTP
  verifyOtp(bookingId: number, otp: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/StatusChangewithOTP/verify-otp`,
      { bookingId, otp },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Create fuel log
  createFuelLog(fuelLog: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Fuelogpostdata`,
      fuelLog,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Create damage details
  createdamagedetails(damagedata: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DamageReportPostData`,
      damagedata,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Set booking to completed
  setBookingToCompleted(bookingId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/status/completed`,
      { bookingId },
      { headers: this.getAuthHeaders(true) }
    );
  }
  // Create security deposit order
  createSecurityDepositOrder(amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/create-security-deposit-order`,
      { amount }
    );
  }

  // Save security deposit
  saveSecurityDeposit(data: { bookingId: number; amount: number }) {
    return this.http.post<any>(
      `${this.baseUrl}/save-security-deposit`,
      data
    );
  }

  // Refund security deposit (change status)
  refundSecurityDeposit(bookingId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/refund-security-deposit-changestatus/${bookingId}`,
      null
    );
  }

  // Get all feedback (Admin)
  getallfeedbackmessage(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminShowFeedBackApi`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= OWNER VEHICLE =================

  // Get all vehicles (Owner)
  getAllVehiclesbyowner(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Vehicle_Owner_/get-owner-vehicles`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Update vehicle (Owner)
  updateVehiclebyowner(vehicleData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/Vehicle_Owner_/update-owner-vehicle`,
      vehicleData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Delete vehicle (Owner)
  deleteVehicleByOwner(vehicleId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/Vehicle_Owner_/delete-owner-vehicle/${vehicleId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= OWNER DOCUMENT =================

  private ownerDocumentUrl = `${this.baseUrl}/OwnerDocument`;

  // Add document
  addDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.ownerDocumentUrl}/add`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get documents
  getDocuments(): Observable<any> {
    return this.http.get<any>(
      `${this.ownerDocumentUrl}/get`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update document
  updateDocument(formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${this.ownerDocumentUrl}/update`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete document
  deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.ownerDocumentUrl}/delete/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= ADMIN – OWNER APPROVAL =================

  // Get pending owners
  getallownervehicle(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminOwners/GetPendingOwners`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Approve owner
  approveOwner(ownerId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/AdminOwners/approve/${ownerId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Reject owner
  rejectOwner(ownerId: number, reason: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/AdminOwners/reject/${ownerId}`,
      { reason },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Get active owners
  getallActiveownervehicle(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminOwners/getAllActiveOwners`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get owner vehicles (Admin)
  getAllOwnerVehicles(ownerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminOwners/getOwnerVehicles/${ownerId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Add or update security deposit (Admin)
  addOrUpdateDeposit(vehicleId: number, amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/AdminOwners/addOrUpdateSecurityDeposit`,
      { vehicleId, amount },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Add availability days (Owner)
  addAvailabilityDays(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Vehicle_Owner_/addAvalibilityDays`,
      data,
      { headers: this.getAuthHeaders(true), responseType: 'text' as 'json' }
    );
  }

  // Approve owner vehicle (Admin)
  approveOwnerVehicle(vehicleId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/AdminOwners/approve`,
      { vehicleId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Reject owner vehicle (Admin)
  RejectOwnerVehicle(vehicleId: number, reason: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/AdminOwners/rejectVehicle`,
      { vehicleId, rejectReason: reason },
      { headers: this.getAuthHeaders() }
    );
  }

  // Set price vehicle (admin → owner payment)
  updateAvailabilityPrice(
    availabilityId: number,
    vehicleAmountPerDay: number
  ): Observable<string> {

    const body = { availabilityId, vehicleAmountPerDay };

    return this.http.put(
      `${this.baseUrl}/AdminOwners/updatePrice`,
      body,
      { headers: this.getAuthHeaders(), responseType: 'text' }
    );
  }

  // Get all owner payment details (Admin)
  getAllOwnerPaymentDetails(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminOwners/get-owner-payment-data`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Admin payment → create order
  createOwnerPaymentOrder(amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/OwnerPayment/CreateOrder`,
      { amount },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Verify owner payment
  verifyOwnerPayment(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/OwnerPayment/VerifyPayment`,
      data,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Get owner payments
  getOwnerPayments(ownerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/OwnerPayment/GetOwnerPayments/${ownerId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Same API (kept as-is)
  getOwnerPaymentsDetails(ownerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/OwnerPayment/GetOwnerPayments/${ownerId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Vehicle re-rent
  VehicleReRent(vehicleId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/VehicleReRent/Re-Rent/${vehicleId}`,
      {},
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Owner dashboard summary
  getSummaryOfTheOwnerDashboard(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/OwnerDashboard/summary`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // ================= DRIVER =================

  // Add / Update driver experience
  AddUpdateDriverExprience(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/addUpdateDriverExprience`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Add driver document
  addDriverDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DriverDocuments/addDriverDocument`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete driver document
  deleteDriverDocument(documentId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/DriverDocuments/deleteDriverDocument/${documentId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get driver documents
  getDriverDocuments(driverId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/DriverDocuments/getDriverDocuments/${driverId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get driver experience
  getDriverExprience(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getDriverExprience`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get all driver details (Admin)
  GetAllDriverDetials(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/driversdata`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Approve driver
  approveDriver(userId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/AdminDriver/approve-driver/${userId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // Reject driver
  rejectDriver(userId: number, rejectionReason: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/AdminDriver/reject-driver`,
      { userId, rejectionReason },
      { headers: this.getAuthHeaders() }
    );
  }

  // Available drivers
  getAvailableDrivers(
    startTime: string,
    endTime: string,
    vehicleType: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}/available-drivers`,
      {
        params: { startTime, endTime, vehicleType }
      }
    );
  }

  // Create driver booking
  createDriverBooking(driverBookingData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/create-driver-booking`,
      driverBookingData
    );
  }

  // Check driver availability
  checkDriverAvailability(
    vehicleId: number,
    bookingId?: number
  ): Observable<any> {

    return this.http.get<any>(
      `${this.baseUrl}/check-driver-availability/${vehicleId}/${bookingId || ''}`
    );
  }

  // Admin – driver trip details
  AdminGetAallDriverdetails(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminDriver/DrivertripsDetails`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  AdminGetAallDriverdetailsbyid(driverId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminDriver/DrivertripsDetails/${driverId}`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Driver – all bookings
  driverGetAallbooking(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/DriverDashboard/DriverTripsDetails`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Driver update status → busy
  driverUpdateStatusBusy(driverBookingId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DriverDashboard/UpdateDriverTripStatus`,
      {},
      {
        headers: this.getAuthHeaders(true),
        params: { driverBookingId }
      }
    );
  }

  // Driver update status → completed
  driverUpdateStatuscompleted(driverBookingId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DriverDashboard/UpdateDriverTripStatusComplete`,
      {},
      {
        headers: this.getAuthHeaders(true),
        params: { driverBookingId }
      }
    );
  }


  // //drive update status is bust
  // driverUpdateStatusInactive(): Observable<any> {
  //   const token = sessionStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  //   const userdataurl = 'http://localhost:7188/api/DriverDashboard/driver/status/update';
  //   return this.http.get<any>(userdataurl, { headers });
  // }

  // Update driver per day rate (Admin)
  updatePerDayRate(driverId: number, perDayRate: number): Observable<any> {
    const payload = { driverId, perDayRate };

    return this.http.put<any>(
      `${this.baseUrl}/AdminDriver/UpdatePerDayRate`,
      payload,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // ================= DRIVER PAYMENT =================

  // Create driver payment order
  createDriverPaymentOrder(amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DriverPayments/CreateOrder`,
      { Amount: amount },
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Verify driver payment
  verifyDriverPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/DriverPayments/VerifyPayment`,
      paymentData,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Admin – all paid drivers report
  getpaymenttabledriver(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/AdminDriver/AllPaidDriversPaymentReport`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // Driver – paid payments list
  getpaymenttablebydriver(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/DriverDashboard/driver/paid-payments`,
      { headers: this.getAuthHeaders(true) }
    );
  }

  // ================= PASSWORD RESET =================

  // Forgot password
  forgotPassword(email: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/Resetpassword/forgot-password`,
      { email },
      { responseType: 'text' }
    );
  }

  // Reset password
  resetPassword(data: any): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/Resetpassword/reset-password`,
      data,
      { responseType: 'text' }
    );
  }
}