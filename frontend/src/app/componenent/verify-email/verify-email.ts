import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Otpservices } from '../../services/otpservices';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail {
  verifyForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private otpService: Otpservices,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    // ✅ Updated: Automatically set email from query param
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.verifyForm.get('email')?.setValue(email);
      }
    });
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, otp } = this.verifyForm.value;

   this.otpService.verifyOtp({ email, otp }).subscribe({
  next: (res: string) => {  // res will be a string now
    this.isLoading = false;
    Swal.fire({
      icon: 'success',
      title: 'Verified!',
      text: res || 'Email verified! You can now login.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigateByUrl('/login');
    });
  },
  error: (err) => {
    this.isLoading = false;
    let errorMessage = 'Verification failed.';
    if (err.error) {
      if (typeof err.error === 'string') {
        errorMessage = err.error;
      } else if (err.error.message) {
        errorMessage = err.error.message;
      } else {
        errorMessage = JSON.stringify(err.error);
      }
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'OK'
    });
  }
});

  }

  resendOtp() {
    const email = this.verifyForm.get('email')?.value;

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Email',
        text: 'Please enter your email to resend OTP.',
        confirmButtonText: 'OK' // ✅ Updated
      });
      return;
    }

    this.otpService.resendOtp({ email }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'info',
          title: 'OTP Sent',
          text: 'A new OTP has been sent to your email.',
          confirmButtonText: 'OK' // ✅ Updated
        });
      },
      error: (err) => {
        const errorMessage =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message || err?.message || 'Failed to resend OTP.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonText: 'OK' // ✅ Updated
        });
      }
    });
  }
}
