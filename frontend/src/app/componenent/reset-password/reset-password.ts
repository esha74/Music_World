import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PasswordResetService } from '../../services/password-reset-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {
  resetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator()]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.resetForm.get('email')?.setValue(params['email']);
      }
      if (params['otp']) {
        this.resetForm.get('otp')?.setValue(params['otp']);
      }
    });
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
      return !valid ? { passwordStrength: true } : null;
    };
  }

  onReset() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }


    const resetRequest = {
      email: this.resetForm.value.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.newPassword
    };

    this.passwordResetService.resetPassword(resetRequest).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          Swal.fire('Success', res.message || 'Password reset successfully! You can now login.', 'success')
            .then(() => this.router.navigate(['/login']));
        } else {
          Swal.fire('Error', res.error || 'Password reset failed', 'error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', err.error?.error || 'Password reset failed', 'error');
      }
    });
  }
}
