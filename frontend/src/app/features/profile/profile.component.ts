import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: User | null = null;
  selectedImage: File | null = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Get current user from localStorage or service
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }

    this.profileForm = this.fb.group({
      name: [this.user?.name || ''],
      bio: [this.user?.bio || ''],
      profileImg: ['']
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  getProfileImgUrl(): string | undefined {
    if (!this.user?.profileImg) return undefined;
    // If already an absolute URL, return as is
    if (this.user.profileImg.startsWith('http')) return this.user.profileImg;
    // Otherwise, prepend backend URL
    return `${environment.backendUrl}/${this.user.profileImg.replace(/\\/g, '/')}`;
  }

  onSubmit(): void {
    if (!this.user) return;
    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('bio', this.profileForm.value.bio);
    if (this.selectedImage) {
      formData.append('profileImg', this.selectedImage);
    }

    this.userService.updateUser(this.user._id, formData).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
        this.userService.setUser(updatedUser);
        this.user = updatedUser;
        // Store the new token if present
        if (updatedUser.token) {
          localStorage.setItem('token', updatedUser.token);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.successMessage = '';
      }
    });
  }
}