import { Injectable } from '@angular/core';
import { ResetPasswordRequest } from '../models/ResetPasswordRequest ';
import { Observable } from 'rxjs';
import { ForgotPasswordRequest } from '../models/ForgotPasswordRequest ';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
 private baseUrl = 'https://localhost:7074/api/PasswordReset';

  constructor(private http: HttpClient) {}

  requestOtpResetPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/forgot-password`,
      request,
      { responseType: 'text' }
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.baseUrl}/reset-password`,
      request,
    );
  }
}
