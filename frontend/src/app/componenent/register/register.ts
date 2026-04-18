import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Authservices } from '../../services/authservices';
import { Router } from '@angular/router';
import { validateHeaderName } from 'http';
import Swal from 'sweetalert2';
import { encryptAES } from '../../utils/aes-encryption';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  Message = '';
  isSuccess = false;

  defaultSecurityQuestions = [
    "What was the name of your first pet?",
    "What is your favorite holiday destination?",
    "What is your favorite food?",
    "What sport did you play in school?",
    "What is your favorite movie?",
    "In what city were you born?",
    "What is your father's name?",
    "What is your favorite hobby?",
    "What subject did you enjoy the most in school?",
    "What is your favorite color?",
    "Who was your best friend in childhood?",
  ];
  randomSecurityQuestion: string = '';

  constructor(private fb: FormBuilder, private authservices: Authservices, private router: Router) { }

  ngOnInit(): void {
        // Randomly select one question
    this.randomSecurityQuestion = this.getRandomQuestion();
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6),this.passwordStrengthValidator()
]],
      confirmPassword: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      profileImage: [null],  // Added file input control here

         // Add controls for security question and answer
      securityQuestion: [this.randomSecurityQuestion, Validators.required], // Pre-fill hidden form control
      securityAnswer: ['', Validators.required]

    }, { validators: this.passwordsMatchValidator });
  }

 getRandomQuestion(): string {
    const index = Math.floor(Math.random() * this.defaultSecurityQuestions.length);
    return this.defaultSecurityQuestions[index];
  }


  
  // Custom validator for matching passwords
  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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

onRegister(): void {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }
  const encryptedPassword = encryptAES(this.registerForm.value.password);
const encryptedconfirmedPassword=encryptAES(this.registerForm.value.confirmPassword);
  const formData = new FormData();
  formData.append('username', this.registerForm.get('username')?.value);
  formData.append('role', this.registerForm.get('role')?.value);
  formData.append('password', encryptedPassword);
  formData.append('confirmPassword', encryptedconfirmedPassword);
  formData.append('email', this.registerForm.get('email')?.value);    // Append email

  formData.append('profileImage', this.registerForm.get('profileImage')?.value);

   // Append new security question and answer
  formData.append('securityQuestion', this.registerForm.get('securityQuestion')?.value);
  formData.append('securityAnswer', this.registerForm.get('securityAnswer')?.value);




this.authservices.Register(formData).subscribe({
    next: () => {
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful. Please verify your email with OTP.',
        icon: 'success',
        confirmButtonText: 'Verify Email'
      }).then(() => {
        // Navigate to OTP verification page with email as query param
        const email = this.registerForm.get('email')?.value;
        this.router.navigate(['/verify-email'], { queryParams: { email } });
      });
    },
    error: () => {
      Swal.fire('Error', 'Registration failed. Please try again.', 'error');
    }
  });
}


  goLogin(): void {
    this.router.navigate(['/login']);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.registerForm.patchValue({
        profileImage: file
      });
      this.registerForm.get('profileImage')?.updateValueAndValidity();
    }
  }
}
