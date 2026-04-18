import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivityLog } from '../../models/ActivityLog';
import { Activitylogservices } from '../../services/activitylogservices';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-activitylog',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './activitylog.html',
  styleUrls: ['./activitylog.css']
})
export class Activitylog implements OnInit {
  logs: ActivityLog[] = [];
  
  currentPage = 1;
  pageSize = 7;
  
  searchUsername: string = '';
  searchUserId: string = '';

  constructor(private logService: Activitylogservices, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.logService.getLogs().subscribe(data => {
      this.logs = data;
      this.cdr.detectChanges();
    });
  }
  
deleteLog(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to delete this log?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.logService.deleteLog(id).subscribe({
        next: () => {
          this.logs = this.logs.filter(log => log.id !== id);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
          this.cdr.detectChanges();

          Swal.fire(
            'Deleted!',
            'Log has been deleted successfully.',
            'success'
          );
        },
        error: (err) => {
          console.error('Delete failed', err);
          Swal.fire(
            'Error!',
            'Failed to delete log. Please try again.',
            'error'
          );
        }
      });
    }
  });
}

  get filteredLogs(): ActivityLog[] {
    return this.logs.filter(log => {
      const matchesUsername = this.searchUsername.trim() === '' || log.username.toLowerCase().includes(this.searchUsername.toLowerCase());
      const matchesUserId = this.searchUserId.trim() === '' || log.userId?.toString().includes(this.searchUserId.trim());
      return matchesUsername && matchesUserId;
    });
  }

  get pagedLogs(): ActivityLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.pageSize);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
