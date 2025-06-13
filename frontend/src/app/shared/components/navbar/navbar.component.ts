import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.userService.clearUser();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
