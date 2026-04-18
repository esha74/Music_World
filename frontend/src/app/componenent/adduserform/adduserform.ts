import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Userservices } from '../../services/userservices';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adduserform',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './adduserform.html',
  styleUrls: ['./adduserform.css']
})
export class Adduserform {
  registerForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private userService: Userservices, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;

    this.userService.addUser(this.registerForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'User added. Please check email to set password.', 'success');
        console.log(this.registerForm.value);
        this.registerForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        let message = 'Failed to add user.';

        if (err.status === 429) {
          message = 'Too many requests. Please wait for 2 minutes before trying again.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            timer: 120000, // 2 minutes in milliseconds
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              // Optional cleanup on close
            }
          }).then(() => {
            this.router.navigate(['/users']);
          });

        } else if (err.error) {
          if (typeof err.error === 'string') {
            message = err.error;
          } else if (err.error.message) {
            message = err.error.message;
          } else {
            message = JSON.stringify(err.error);
          }

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
          });

        } else if (err.message) {
          message = err.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
          });
        }
      }
    });
  }
}
