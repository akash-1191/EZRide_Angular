import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { DateAvailabilityDTO } from './date-availability.model';
export interface AvailabilitySlot {
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
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
    const token = sessionStorage.getItem('token');  // If auth required
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
    return this.http.post<any>(apiUrl, data);
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
  // getAvailability(vehicleId: number, startDate: string, endDate: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('vehicleId', vehicleId.toString())
  //     .set('startDate', startDate)
  //     .set('endDate', endDate);

  //   const url = `http://localhost:7188/api/Booking/availability`;
  //   return this.http.get<any>(url, { params });
  // }  


  getAvailability(vehicleId: number, startDateTime: string, endDateTime: string): Observable<AvailabilitySlot[]> {
    const params = new HttpParams()
      .set('vehicleId', vehicleId.toString())
      .set('startDateTime', startDateTime)
      .set('endDateTime', endDateTime);

    return this.http.get<AvailabilitySlot[]>('/api/Booking/availability', { params });
  }

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



  //add feed back message top the user 
  addFeedback(feedback: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `http://localhost:7188/api/Feedback/addFeedbackmsg`;
    return this.http.post<any>(url, feedback, { headers });
  }


}
