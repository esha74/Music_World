import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Authservices } from '../../services/authservices';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
storedProfileImage: string | null=null ;
baseUrl = 'https://localhost:7074'; 

  constructor(private authservices:Authservices,private router:Router){}
  user=localStorage.getItem('username');
  userrole=localStorage.getItem('userrole');
  ngOnInit(): void {
    
  this.storedProfileImage=localStorage.getItem('imagepath');
  }

goEditProfile(): void {
  // Replace 'userId' with logic to get the current user's ID.
  const userId = localStorage.getItem('userid');
  this.router.navigate(['/edit-profile', userId]);
}

goChangePassword(): void {
  this.router.navigate(['/change-password']);
}

  logout(): void {
    this.authservices.removeToken();
    localStorage.removeItem('userrole');
    localStorage.removeItem('username');
    localStorage.removeItem('imagepath');
    localStorage.removeItem('userid');

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
