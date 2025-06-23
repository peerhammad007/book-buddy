// frontend/src/app/core/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  private user: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();


  constructor(private http: HttpClient) {
    // On service init, load user from localStorage if present
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.userSubject.next(this.user);
    }
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, data: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }


  setUser(user: User | null) {
    this.user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.userSubject.next(user);
  }

  getCurrentUser(): User | null {
    if (!this.user) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
        this.userSubject.next(this.user);
      }
    }
    return this.user;
  }

  clearUser() {
    this.setUser(null);
  }

}
