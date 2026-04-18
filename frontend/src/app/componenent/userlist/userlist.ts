import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Userservices } from '../../services/userservices';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userlist',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './userlist.html',
  styleUrls: ['./userlist.css']
})
export class Userlist implements OnInit {
  usersList: User[] = [];
  errorMessage = '';

  baseUrl = 'https://localhost:7074';

  currentPage = 1;
  pageSize = 5;

  searchTerm: string = '';

  constructor(private userservices: Userservices, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userservices.getAllUsers().subscribe({
      next: (users) => {
        this.usersList = users.filter(user => user.role.toLowerCase() !== 'admin');
        this.currentPage = 1;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load users.';
      }
    });
  }

  getDisplayedUsers(): User[] {
    let data = this.usersList;

    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      const term = this.searchTerm.toLowerCase();
      data = this.usersList.filter(user => user.username.toLowerCase().includes(term));
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return data.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    let length = this.usersList.length;
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      length = this.usersList.filter(user => user.username.toLowerCase().includes(this.searchTerm.toLowerCase())).length;
    }
    return Math.ceil(length / this.pageSize);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  acceptUser(user: User) {
    this.userservices.acceptUser(user.id!).subscribe(() => {
      Swal.fire('Accepted', `User "${user.username}" has been accepted.`, 'success');
      this.loadUsers();
      user.isApproved = true;
      this.cdr.detectChanges();
    });
  }

  declineUser(user: User) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to decline this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, decline user!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userservices.restrictUser(user.id!).subscribe(() => {
          user.isApproved = false;
          this.loadUsers();
          this.cdr.detectChanges();
          Swal.fire('Declined!', 'User has been declined.', 'success');
        });
      }
    });
  }

  navigateToAddUser() {
    this.router.navigate(['/add-user']);
  }
}
