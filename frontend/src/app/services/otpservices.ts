import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authservices } from './authservices';

@Injectable({
  providedIn: 'root'
})
export class Otpservices {
  private baseUrl = 'https://localhost:7074/api/Otp';

  constructor(private http: HttpClient,private authservices:Authservices) {}

 private getAuthHeaders(){
    const token=this.authservices.getToken();
    return new HttpHeaders({
      'Authorization':token?`Bearer ${token}`:``,
      
    })
  }

verifyOtp(data: { email: string; otp: string }): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/verify-otp`,
    data,
    { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    }
  );
}


 resendOtp(data: { email: string }): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/resend-otp`,
    data,
    { headers: this.getAuthHeaders(), responseType: 'text' }
  );
}
}

