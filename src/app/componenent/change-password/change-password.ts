import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Authservices } from '../../services/authservices';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangePasswordModel } from '../../models/ChangePassword';
import { encryptAES } from '../../utils/aes-encryption';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
 changePasswordForm!: FormGroup;
  userId!: number;
  securityQuestion: string = '';

  constructor(
    private fb: FormBuilder,
    private authservices: Authservices,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userid');
    if (storedId) {
      this.userId = +storedId;
    }

this.authservices.getSecurityQuestion(this.userId).subscribe({
        next: (res) => this.securityQuestion = res.securityQuestion,
        error: () => this.securityQuestion = 'Unable to load security question'
      });
    

    this.changePasswordForm = this.fb.group({
      securityAnswer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const model: ChangePasswordModel = {
      userId: this.userId,
      securityAnswer: this.changePasswordForm.get('securityAnswer')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    };

    this.authservices.changePassword(model).subscribe({
      next: () => {
        Swal.fire('Success', 'Your password has been changed successfully.', 'success');
        this.changePasswordForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire('Error', err.error || 'Failed to change password.', 'error');
      }
    });
  }
}
