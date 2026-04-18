import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Userservices } from '../../services/userservices';
import { CommonModule } from '@angular/common';
import { encryptAES } from '../../utils/aes-encryption';

@Component({
  selector: 'app-set-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css'
})
export class SetPassword implements OnInit{
setPassForm: FormGroup;
  token: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: Userservices,
    private router: Router
  ) {
    this.setPassForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6),this.passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatch(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
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

  onSubmit() {
    if (this.setPassForm.invalid || !this.token) return;

    this.loading = true;
const model = {
  token: this.token,
  password: this.setPassForm.get('password')?.value,
  confirmPassword: this.setPassForm.get('confirmPassword')?.value
};
    this.userService.setPassword(model).subscribe({
      next: () => {
        Swal.fire('Success', 'Password set successfully. Please login.', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: err => {
        Swal.fire('Error', err.error || 'Failed to set password', 'error');
        this.loading = false;
      }
    });
  }
}

