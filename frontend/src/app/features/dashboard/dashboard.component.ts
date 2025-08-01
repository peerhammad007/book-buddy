import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  loading = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getProfileImageUrl(filename: string): string {
    // If already an absolute URL, return as is
    if (filename.startsWith('http')) {
      return filename;
    }
    // Otherwise, prepend backend URL
    return `${environment.backendUrl}/${filename.replace(/\\/g, '/')}`;
  }
}
