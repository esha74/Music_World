import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservices } from './authservices';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AddUser } from '../models/AddUser ';
import { SetPassword } from '../models/SetPassword';

@Injectable({
  providedIn: 'root'
})
export class Userservices {
    private api="https://localhost:7074/api/Users"
  constructor(private http:HttpClient,private authservices:Authservices){}

  
  private getAuthHeaders(){
    const token=this.authservices.getToken();
    return new HttpHeaders({
      'Authorization':token?`Bearer ${token}`:``,
      'Content-Type':'application/json'
    })
  }

    // Get all users (admin only)
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${this.api}`, { headers: this.getAuthHeaders() });
  }

  addUser(data: AddUser): Observable<any> {
    return this.http.post(`${this.api}/add-user`, data,{ headers: this.getAuthHeaders() });
  }

  setPassword(data: SetPassword): Observable<any> {
    return this.http.post(`${this.api}/set-password`, data,{ headers: this.getAuthHeaders() });
  }

editProfile(id: number, formData: FormData):Observable<User> {
  const token = this.authservices.getToken();
  return this.http.put<User>(`https://localhost:7074/api/Users/${id}/edit`, formData, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
      // Don't set 'Content-Type' for FormData; browser handles it
    }
  });
}


getById(id:number):Observable<User>{
  return this.http.get<User>(`${this.api}/${id}`,{headers:this.getAuthHeaders()});
}

acceptUser(id: number): Observable<any> {
  return this.http.post(`${this.api}/${id}/accept`, {}, { headers: this.getAuthHeaders() });
}

restrictUser(id: number): Observable<any> {
  return this.http.post(`${this.api}/${id}/restrict`, {}, { headers: this.getAuthHeaders() });
}



 confirmPayPalSubscription(subscriptionId: string): Observable<any> {
    return this.http.post(`${this.api}/payment/confirm-subscription`, { subscriptionId }, { headers: this.getAuthHeaders() });
  }

uploadProfileImage(file: File): Observable<{ imagePath: string }> {
  const formData = new FormData();
  formData.append('profileImage', file);

  return this.http.post<{ imagePath: string }>(
    `${this.api}/Users/upload-profile-image`,
    formData,
    { headers:this.getAuthHeaders() });
}


}
