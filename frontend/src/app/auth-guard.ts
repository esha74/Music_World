import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';  // ✅ Import SweetAlert2

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const role = localStorage.getItem('userrole');
    if (role === 'Admin') {
      return true;
    } else {
      // ✅ Use SweetAlert2 instead of alert()
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only Admins are allowed to access this page!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/access-denied']);
      });

      return false;
    }
  }
}
