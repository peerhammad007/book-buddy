import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  loading = true;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const userId = this.parseUserIdFromToken(token);
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  parseUserIdFromToken(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id;
  }
}
