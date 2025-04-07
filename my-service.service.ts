import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  constructor(private http:HttpClient) { }
  
  private LoginApi="https://localhost:7188/api/Login";
  private SignUpApiurl="https://localhost:7188/api/Signup";

  // signup api
  postdat(obj:any): Observable<any>{
    return this.http.post<any>(this.SignUpApiurl,obj)  
  }

  // loginApi
  LoginpostData(obj1:any):Observable<any>{
    return this.http.post<any>(this.LoginApi,obj1);
  }
}
