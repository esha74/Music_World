import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Music } from '../models/music';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Authservices } from './authservices';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class Musicservices {
  private url="https://localhost:7074/api/Music";
  constructor(private http:HttpClient,private authservices:Authservices){}

  private getAuthHeaders(){
    const token=this.authservices.getToken();
    return new HttpHeaders({
      'Authorization':token?`Bearer ${token}`:``,
      'Content-Type':'application/json'
    })
  }

  getAll():Observable<Music[]>{
    return this.http.get<Music[]>(this.url,{headers:this.getAuthHeaders()});
  }

  getById(id:number):Observable<Music>{
    return this.http.get<Music>(`${this.url}/${id}`,{headers:this.getAuthHeaders()});
  }

  create(mu:Music):Observable<Music>{
    return this.http.post<Music>(this.url,mu,{headers:this.getAuthHeaders()});
  }

  update(mu:Music):Observable<void>{
    return this.http.put<void>(`${this.url}/${mu.id}`,mu,{headers:this.getAuthHeaders()});
  }
  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`,{headers:this.getAuthHeaders()});
  }





}