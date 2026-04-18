import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PasswordResetService } from '../../services/password-reset-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
forgotForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private passwordResetService: PasswordResetService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.passwordResetService.requestOtpResetPassword(this.forgotForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('OTP Sent', 'An OTP has been sent to your email. Please check your inbox.', 'success').then(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email: this.forgotForm.get('email')?.value } });
        });
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error || 'Failed to send OTP', 'error');
      }
    });
  }
}

