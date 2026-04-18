import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authservices } from '../../services/authservices';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Loginresponse } from '../../models/LoginResponse';
import { Loginrequest } from '../../models/loginrequest';
import { encryptAES } from '../../utils/aes-encryption';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading = false;


  constructor(private fb: FormBuilder, private authservices: Authservices, private router: Router) { }

  ngOnInit(): void {
    this.initform();
  }

  initform(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onlogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const encryptedPassword = encryptAES(this.loginForm.value.password);
     const loginData = {
  username: this.loginForm.value.username,
  password: encryptedPassword
};

    console.log('Username:', this.loginForm.get('username')?.value);
    this.authservices.Login(loginData).subscribe({
      next: (data: Loginresponse) => {
        this.isLoading = false;
        if (data.role === "User" && !data.isApproved) {
          this.errorMessage = 'Your account approval is pending from admin.';
          console.log(data.isApproved);
          Swal.fire({
            title: 'Pending Approval',
            text: this.errorMessage,
            icon: 'info',
            confirmButtonText: 'OK'
          });

          return;
        }

        if (typeof window !== 'undefined' && window.localStorage) {
          this.authservices.setToken(data.token);
          localStorage.setItem('userrole', data.role);
          localStorage.setItem('username', data.username);
          localStorage.setItem('imagepath', data.profileImagePath || '');
          localStorage.setItem('userid', data.id.toString());
        }

        Swal.fire({
          title: 'Success!',
          text: `Welcome back, ${data.username}!`,
          icon: 'success',
          confirmButtonText: 'Continue'
        }).then(() => this.router.navigate(['/home']));
      },
      error: (err) => {
        this.isLoading = false;
        // Show backend error message if available (e.g. account locked)
        const backendMsg = err.error?.message || err.error || 'Invalid username or password';
        this.errorMessage = backendMsg;
         Swal.fire({
          title: 'Error!',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    });
  }
  goForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }


  goRegister() {
    this.router.navigate(['/register']);
  }

}
