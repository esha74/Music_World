import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Loginrequest } from '../models/loginrequest';
import { Loginresponse } from '../models/LoginResponse';
import { ChangePasswordModel } from '../models/ChangePassword';

@Injectable({
  providedIn: 'root'
})
export class Authservices {
  private apiurl = 'https://localhost:7074/api/Auth'

  constructor(private http: HttpClient) { }

  Register(u: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiurl}/register`, u)
  }

  Login(l: Loginrequest): Observable<Loginresponse> {
    return this.http.post<Loginresponse>(`${this.apiurl}/login`, l)
  }

changePassword(model: ChangePasswordModel) {
  return this.http.post(`${this.apiurl}/change-password`, model);}

getSecurityQuestion(userId: number): Observable<{ securityQuestion: string }> {
  return this.http.get<{ securityQuestion: string }>(`${this.apiurl}/get-security-question/${userId}`);
}


  getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('jwt');
    }
    return null;
  }



  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  removeToken() {
    localStorage.removeItem('jwt');
  }

}
