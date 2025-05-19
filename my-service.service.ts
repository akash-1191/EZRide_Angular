import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/Profile/${userId}`;
    return this.http.get<any>(url, { headers });
  }

  // updateprofiledata
  UpdateUserData(updateData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const UpdateProfileApiUrl = `http://localhost:7188/api/update-profile`;
    return this.http.put<any>(UpdateProfileApiUrl, updateData, { headers });
  }

  // UpdateProfile Image of the user

  updateUserImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const UadateProfileImage = `http://localhost:7188/api/update-profile-image`
    return this.http.put<any>(UadateProfileImage, formData, { headers });
  }


  // Add Vehicle
  addVehicle(vehicleData: any): Observable<any> {
    const token = localStorage.getItem('token');  // If auth required
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `http://localhost:7188/api/addVehicle`;
    return this.http.post<any>(url, vehicleData, { headers });
  }

  // Get All Vehicles (for Admin)
  getAllVehicles(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `http://localhost:7188/api/getAllVehicles`;
    return this.http.get<any>(url, { headers });
  }

  // Update Vehicle Data
  updateVehicle(vehicleData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const updateApiUrl = `http://localhost:7188/api/updateVehicle`;
    return this.http.put<any>(updateApiUrl, vehicleData, { headers });
  }

  //Delete data vehicle
  deleteVehicle(vehicleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:7188/api/deleteVehicle/${vehicleId}`;
    return this.http.delete<any>(url, { headers });
  }
}
