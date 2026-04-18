import { Injectable } from '@angular/core';
import { ActivityLog } from '../models/ActivityLog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Activitylogservices {
    private url="https://localhost:7074/api";

  constructor(private http: HttpClient) {}

  getLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.url}/ActivityLog`);
  }
    deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/ActivityLog/${id}`);
  }
}
