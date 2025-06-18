import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isLender: [false],
      bio: ['']
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      
      // Append form fields to FormData
      Object.keys(this.registerForm.value).forEach(key => {
        formData.append(key, this.registerForm.value[key]);
      });

      // Append the file if selected
      if (this.selectedFile) {
        formData.append('profileImg', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          console.log('Registration successful:', res);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed';
        }
      });
    }
  }
}
