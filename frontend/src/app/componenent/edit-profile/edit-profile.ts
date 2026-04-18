import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Userservices } from '../../services/userservices';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {
  profileForm!: FormGroup;
  userId!: number;
  existingImagePath?: string;
  previewImageUrl?: string;
  baseUrl = "https://localhost:7074/";

  constructor(
    private fb: FormBuilder,
    private userService: Userservices,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      profileImage: [null]
    });

    this.userService.getById(this.userId).subscribe(user => {
      this.profileForm.patchValue({ username: user.username });
      this.existingImagePath = user.profileImagePath;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.patchValue({ profileImage: file });
      this.profileForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('username', this.profileForm.get('username')?.value);
    const profileImage = this.profileForm.get('profileImage')?.value;
    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }

    this.userService.editProfile(this.userId, formData).subscribe({
      next: (updatedUser: User) => {
        if (updatedUser) {
          this.profileForm.patchValue({
             username: updatedUser.username });
          this.existingImagePath = updatedUser.profileImagePath;
          this.previewImageUrl = undefined;
        }
        if(updatedUser.username){
          localStorage.setItem('username',updatedUser.username);
        }
   // ✅ Save the new profile image path to localStorage
        if (updatedUser.profileImagePath) {
          localStorage.setItem('imagepath', updatedUser.profileImagePath);
        }

        Swal.fire('Success', 'Profile updated!', 'success');
        this.router.navigate(['/list'])
      },
      error: () => {
        Swal.fire('Error', 'Failed to update profile', 'error');
      }
    });
  }
}
