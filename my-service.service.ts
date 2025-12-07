import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
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

  constructor(private http: HttpClient) { }

  private LoginApi = "http://localhost:7188/api/Login";
  private SignUpApiurl = "http://localhost:7188/api/Signup";

  // signup api
  postdat(obj: any): Observable<any> {
    return this.http.post<any>(this.SignUpApiurl, obj)
  }

  // loginApi
  LoginpostData(obj1: any): Observable<any> {
    return this.http.post<any>(this.LoginApi, obj1);
  }

  // ProfileApi
  UserProfiledata(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/Profile/${userId}`;
    return this.http.get<any>(url, { headers });
  }

  // updateprofiledata
  UpdateUserData(updateData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const UpdateProfileApiUrl = `http://localhost:7188/api/update-profile`;
    return this.http.put<any>(UpdateProfileApiUrl, updateData, { headers });
  }

  // UpdateProfile Image of the user
  updateUserImage(formData: FormData): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const UadateProfileImage = `http://localhost:7188/api/update-profile-image`
    return this.http.put<any>(UadateProfileImage, formData, { headers });
  }


  // Add Vehicle
  addVehicle(vehicleData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `http://localhost:7188/api/addVehicle`;
    return this.http.post<any>(url, vehicleData, { headers });
  }

  // Get All Vehicles (for Admin)
  getAllVehicles(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/getAllVehicles`;
    return this.http.get<any>(url, { headers });
  }

  // Update Vehicle Data
  updateVehicle(vehicleData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const updateApiUrl = `http://localhost:7188/api/updateVehicle`;
    return this.http.put<any>(updateApiUrl, vehicleData, { headers });
  }

  //Delete data vehicle
  deleteVehicle(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/deleteVehicle/${vehicleId}`;
    return this.http.delete<any>(url, { headers });
  }


  // Add Image for Vehicle
  uploadVehicleImage(vehicleId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('VehicleId', vehicleId.toString());
    formData.append('ImageFile', imageFile);

    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/uploadVehicleImage`;
    return this.http.post<any>(url, formData, { headers });
  }


  // Get All Images by Vehicle ID
  getVehicleImages(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/getImagesByVehicle/${vehicleId}`;
    return this.http.get<any>(url, { headers });
  }

  // Update Vehicle Image
  // updateVehicleImage(vehicleImageId: number, formData: FormData): Observable<any> {
  //   const token = sessionStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });

  //   const url = `http://localhost:7188/api/updateVehicleImage/${vehicleImageId}`;
  //   return this.http.put<any>(url, formData, { headers });
  // }


  // Delete Vehicle Image
  deleteVehicleImage(vehicleImageId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/deleteVehicleImage/${vehicleImageId}`;
    return this.http.delete<any>(url, { headers });
  }


  //insert and updaete price of the perticular vehicle
  insertOrUpdatePricing(data: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const apiurl = `http://localhost:7188/api/set-Or-price`;
    return this.http.post(apiurl, data, { headers });
  }


  //get all prive according to the vehicle id 
  getPricingByVehicleId(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/get-by-vehicle/${vehicleId}`;
    return this.http.get(url, { headers });
  }


  //get aal data of the 3 table vehhicle price and vehicleimage
  getAllVehiclesdetails(): Observable<any[]> {
    const url = 'http://localhost:7188/api/GetAllVehicle';
    return this.http.get<any[]>(url);
  }



  // Get Vehicle Details by ID
  getVehicleDetailsById(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/GetAllVehicleById/${vehicleId}`;
    return this.http.get<any>(url, { headers });
  }

  //booking details insert in the booking table 
  confirmBooking(data: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const apiUrl = `http://localhost:7188/api/Booking/addbooking`;
    return this.http.post<any>(apiUrl, data, { headers });
  }


  // get all data of the vehicle table by user id
  getAllBookings(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const apiUrl = `http://localhost:7188/api/Booking/my-bookings`;
    return this.http.get<any>(apiUrl, { headers });
  }


  //cancel booking 
  cancelBooking(bookingId: number, userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const apiUrl = `http://localhost:7188/api/Booking/cancelbooking/${bookingId}?userId=${userId}`;
    return this.http.put<any>(apiUrl, {}, { headers });
  }



  //do payment api with rozerpage
  createOrder(data: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = 'http://localhost:7188/api/Payment/CreateOrder';
    return this.http.post<any>(url, data, { headers });
  }

  //do payment api with rozerpage verify and done payments store data in tha payment table
  verifyAndSavePayment(payment: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = 'http://localhost:7188/api/Payment/VerifyPayment';
    return this.http.post<any>(url, payment, { headers });
  }

  //  Booking Filter API
  getFilteredBookings(filter: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = 'http://localhost:7188/api/Booking/my-bookings/filter';
    return this.http.post<any>(url, filter, { headers });
  }



  //add securityamount in the security tabel
  addSecurityDeposit(depositData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const apiUrl = `http://localhost:7188/api/addSecurityDepositPayment`;
    return this.http.post<any>(apiUrl, depositData, { headers });
  }

  //find the data according to the userid of the securit deposite amount table
  getSecurityDepositsByUser(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `http://localhost:7188/api/SecurityDeposit/${userId}`;
    return this.http.get<any>(url, { headers });
  }



  // upload Documnet api 
  uploadDocuments(formData: FormData): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const uploadDoc = `http://localhost:7188/api/uploadCustomerDocument`;
    return this.http.post(uploadDoc, formData, { headers });
  }

  // check using this api perticular user uploas yopr document or not 
  checkDocumentsUploaded(userId: number): Observable<{ exists: boolean }> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `http://localhost:7188/api/checkDocumentsUploaded/${userId}`;
    return this.http.get<{ exists: boolean }>(url, { headers });
  }

  //get all documnet of the Pertucular user
  getCustomerDocument(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `http://localhost:7188/api/getCustomerDocument/${userId}`;
    return this.http.get(url, { headers });
  }

  updateUserDocumentFieldToNull(userId: number, fieldName: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/update-document-field-null/${userId}/${fieldName}`;
    return this.http.put<any>(url, {}, { headers });
  }

  // get payment status 
  paymentStatusDetails(UserId: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `http://localhost:7188/api/user-PaymentDetails/${UserId}`;
    return this.http.get(url, { headers });
  }


  //  Check vehicle availability by date
  getAvailability(vehicleId: number, startDateTime: string, endDateTime: string): Observable<AvailabilitySlot[]> {
    const params = new HttpParams()
      .set('vehicleId', vehicleId.toString())
      .set('startDateTime', startDateTime)
      .set('endDateTime', endDateTime);

    const url = 'http://localhost:7188/api/Booking/availability';

    return this.http.get<AvailabilitySlot[]>(url, { params });
  }

  // getAvailability(vehicleId: number, startDateTime: string, endDateTime: string): Observable<AvailabilitySlot[]> {
  //   const params = new HttpParams()
  //     .set('vehicleId', vehicleId.toString())
  //     .set('startDateTime', startDateTime)
  //     .set('endDateTime', endDateTime);

  //   return this.http.get<AvailabilitySlot[]>('/api/Booking/availability', { params });
  // }

  //recipt download
  downloadReceipt(userId: number, bookingId: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const baseUrl = 'http://localhost:7188/api/PaymentReceipt';
    return this.http.get(`${baseUrl}/download/${userId}/${bookingId}`, {
      headers,
      responseType: 'blob',
    });
  }


  // send pdf in the email id 
  sendReceiptEmail(userId: number, bookingId: number, email: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const baseUrl = 'http://localhost:7188/api/PaymentReceipt';
    return this.http.post(`${baseUrl}/send-email?userId=${userId}&bookingId=${bookingId}`, JSON.stringify(email), { headers, responseType: 'text' as 'json' });
  }



  //add feed back message to the user 
  addFeedback(feedback: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/Feedback/addFeedbackmsg`;
    return this.http.post<any>(url, feedback, { headers });
  }


  //get total count of the booking peerticular user

  TotalBookingsCount(userId: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const TotalBookingsCount = `http://localhost:7188/api/BookingSummary/total-bookings/${userId}`;
    return this.http.get<any>(TotalBookingsCount, { headers });
  }


  //total booking vehicle by  user by type
  TatolVehicleBookingCount(userId: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const TatalVehicleBookingCount = `http://localhost:7188/api/BookingSummary/booked-vehicle-type-count/${userId}`;
    return this.http.get<any>(TatalVehicleBookingCount, { headers });
  }

  //total vehicla avalible count in the website 
  TatolAvalibleVehicleCount(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const TatolAvalibleVehicleCount = `http://localhost:7188/api/BookingSummary/available-vehicle-count`;
    return this.http.get<any>(TatolAvalibleVehicleCount, { headers });
  }


  //pendinga amount to ahow the user
  pandingAmount(userId: number): Observable<number> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const pandingAmount = `http://localhost:7188/api/BookingSummary/pending-payment-count/${userId}`;
    return this.http.get<number>(pandingAmount, { headers })
  }

  //last refended amount
  LastRefendedamount(userId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const refaundurl = `http://localhost:7188/api/BookingSummary/latest-refund/${userId}`;
    return this.http.get<any>(refaundurl, { headers });
  }

  //add contack form data
  Contackmessage(obj: any): Observable<any> {
    const url = 'http://localhost:7188/api/Contact/add';
    return this.http.post<any>(url, obj);
  }

  //get contect message o the contact table 
  contactMessageLoad(): Observable<any> {
    const LoadContectMessage = `http://localhost:7188/api/Contact/allContactDetails`;
    return this.http.get<any>(LoadContectMessage);
  }


  // send message in the watsapp to the user number this message send to use third party

  // private apiUrl = 'https://api.ultramsg.com/instance124193/messages/chat';
  // private token = 'z5lhl4h70gppj4k8';

  // sendMessage(phone: string, message: string): Observable<any> {
  //   const body = new HttpParams()
  //     .set('token', this.token)
  //     .set('to', phone)
  //     .set('body', message);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   });

  //   return this.http.post(this.apiUrl, body.toString(), { headers });
  // }



  // send message in the watsapp to the user number own create api
  sendMessage(phone: string, message: string): Observable<any> {
    const body = {
      phone: phone,
      message: message
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const apiUrl = 'http://localhost:7188/api/WhatsApp/sendWhatsAppMessage';
    return this.http.post(apiUrl, body, { headers });
  }



  //admin get all use that is book or not vehiclde 
  getAllDataOftheUser(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const userdataurl = `http://localhost:7188/api/user-booking-info`;
    return this.http.get<any>(userdataurl, { headers });
  }

  //admin get all use that is security or not vehiclde 
  getAllSecurityrefaund(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const userdataurl = `http://localhost:7188/api/ReturnSecurityAmount`;
    return this.http.get<any>(userdataurl, { headers });
  }

  /// all charges

  getAlldamagecharges(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const userdataurl = `http://localhost:7188/api/ShowDamageChargi`;
    return this.http.get<any>(userdataurl, { headers });
  }
  //cancel resion display  to the user by the admin
  getallCancelResion(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userdataurl = `http://localhost:7188/api/CancelledBookings`;
    return this.http.get<any>(userdataurl, { headers });
  }

  //current ride to be  display to the user by the admin
  getCurrentRide(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userdataurl = `http://localhost:7188/api/bookings/inprogressStatus`;
    return this.http.get<any>(userdataurl, { headers });
  }

  //admin put the mesage for the cancel reasion
  updateCancelReason(bookingId: number, cancelReason: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/cancel-reason`;
    const body = {
      BookingId: bookingId,
      Cancelreasion: cancelReason
    };
    return this.http.put<any>(url, body, { headers });
  }

  //admin hanover the vehiicle to the customer
  setInProgress(bookingId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { bookingId };

    return this.http.put<any>('http://localhost:7188/api/status/inprogress', body, { headers });
  }


  //send otp click button
  sendOtp(bookingId: number, AdminEmail: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = {
      bookingId: bookingId,
      adminEmail: AdminEmail
    };
    return this.http.post<any>('http://localhost:7188/api/StatusChangewithOTP/send-otp', body, { headers });
  }


  verifyOtp(bookingId: number, otp: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const verifyOtp = 'http://localhost:7188/api/StatusChangewithOTP/verify-otp';
    return this.http.post<any>(verifyOtp, { bookingId, otp }, { headers });
  }


  //add fuiel data is 
  createFuelLog(fuelLog: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/Fuelogpostdata`;
    return this.http.post<any>(url, fuelLog, { headers });
  }


  //add damage data is 
  createdamagedetails(damagedata: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/DamageReportPostData`;
    return this.http.post<any>(url, damagedata, { headers });
  }

  //complet bookg by admin

  setBookingToCompleted(bookingId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = { bookingId };
    const url = 'http://localhost:7188/api/status/completed';

    return this.http.put(url, body, { headers });
  }

  //dopayment security deposit return
  // createSecurityDepositOrder(amount: number): Observable<any> {
  //   return this.http.post('http://localhost:7188/api/create-security-deposit-order', amount);
  // }
  createSecurityDepositOrder(amount: number): Observable<any> {
    return this.http.post('http://localhost:7188/api/create-security-deposit-order', { amount });
  }


  //after payment change the status of th esecurity deposit table 

  refundSecurityDeposit(bookingId: number): Observable<any> {
    const url = `http://localhost:7188/api/refund-security-deposit-changestatus/${bookingId}`;
    return this.http.put(url, null); // null because we don’t send a body
  }

  getallfeedbackmessage(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userdataurl = `http://localhost:7188/api/AdminShowFeedBackApi`;
    return this.http.get<any>(userdataurl, { headers });
  }



  // Get All Vehicles (for vehicle owner)
  getAllVehiclesbyowner(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/Vehicle_Owner_/get-owner-vehicles`;
    return this.http.get<any>(url, { headers });
  }

  // Update Vehicle Data by owner
  updateVehiclebyowner(vehicleData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const updateApiUrl = `http://localhost:7188/api/Vehicle_Owner_/update-owner-vehicle`;
    return this.http.put<any>(updateApiUrl, vehicleData, { headers });
  }


  //Delete data vehicle by owner
  deleteVehicleByOwner(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/Vehicle_Owner_/delete-owner-vehicle/${vehicleId}`;
    return this.http.delete<any>(url, { headers });
  }



  private baseApiUrl = "http://localhost:7188/api/OwnerDocument";


  // Add document
  addDocument(formData: FormData): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseApiUrl}/add`, formData, { headers });
  }

  // Get all documents
  getDocuments(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseApiUrl}/get`, { headers });
  }

  // Update document
  updateDocument(formData: FormData): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.baseApiUrl}/update`, formData, { headers });
  }

  // Delete document
  deleteDocument(id: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.baseApiUrl}/delete/${id}`, { headers });
  }



  //  1) GET all  owners
  getallownervehicle(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = 'http://localhost:7188/api/AdminOwners/GetPendingOwners';
    return this.http.get<any>(url, { headers });
  }

  //  APPROVE owner
  approveOwner(ownerId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/AdminOwners/approve/${ownerId}`;
    return this.http.put<any>(url, {}, { headers });
  }

  //  REJECT owner with Reason
  rejectOwner(ownerId: number, reason: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { reason: reason };
    const url = `http://localhost:7188/api/AdminOwners/reject/${ownerId}`;
    return this.http.put<any>(url, body, { headers });
  }



  //  1) GET all  Aproved owners
  getallActiveownervehicle(): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = 'http://localhost:7188/api/AdminOwners/getAllActiveOwners';
    return this.http.get<any>(url, { headers });
  }


  //get uploaded vehicle of the owner for admin
  getAllOwnerVehicles(ownerId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/AdminOwners/getOwnerVehicles/${ownerId}`;
    return this.http.get<any>(url, { headers });
  }


  //add or update the security amount 
  addOrUpdateDeposit(vehicleId: number, amount: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = 'http://localhost:7188/api/AdminOwners/addOrUpdateSecurityDeposit';
    const body = { vehicleId, amount };
    return this.http.post<any>(url, body, { headers });
  }


  // Add Vehicle Availability (Owner)
  addAvailabilityDays(data: any): Observable<any> {
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = 'http://localhost:7188/api/Vehicle_Owner_/addAvalibilityDays';

    return this.http.post<any>(url, data, { headers, responseType: 'text' as 'json' });
  }


  //admin give the aproval of owners vehicles
  approveOwnerVehicle(vehicleId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/AdminOwners/approve`;
    const body = {
      vehicleId: vehicleId
    }
    return this.http.put<any>(url, body, { headers });
  }

  //admin give the aproval of owners vehicles
  //admin reject owner vehicle
  RejectOwnerVehicle(vehicleId: number, reason: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = {
      vehicleId: vehicleId,
      rejectReason: reason
    };

    return this.http.put<any>(`http://localhost:7188/api/AdminOwners/rejectVehicle`, body, { headers });
  }


  //set to price vehicle to pay the vehicle owner
 updateAvailabilityPrice(availabilityId: number, vehicleAmountPerDay: number): Observable<string> {
  const token = sessionStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const body = { availabilityId, vehicleAmountPerDay };
  const url = `http://localhost:7188/api/AdminOwners/updatePrice`;

  // Important: responseType: 'text' taaki JSON parse na ho
  return this.http.put(url, body, { headers, responseType: 'text' });
}



}


