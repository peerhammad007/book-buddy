import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BorrowRequest } from '../models/borrow.model';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private apiUrl = `${environment.apiUrl}/borrow`;

  constructor(private http: HttpClient) {}

  // Request to borrow a book
  requestBorrow(data: { bookId: string; dueDate?: string }): Observable<BorrowRequest> {
    return this.http.post<BorrowRequest>(this.apiUrl, data);
  }

  // Approve or reject a borrow request
  respondToRequest(requestId: string, status: 'approved' | 'rejected'): Observable<BorrowRequest> {
    return this.http.put<BorrowRequest>(`${this.apiUrl}/${requestId}/decision`, { status });
  }

  // Mark a book as returned
  markAsReturned(requestId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestId}/return`, {});
  }

  // Get borrow history for the current user
  getBorrowHistory(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/history`);
  }

  // Get all borrow requests for the current user (both as borrower and lender)
  getUserBorrowRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/history?active=true`);
  }

  // Get pending requests for a specific book
  getBookRequests(bookId: string): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(`${this.apiUrl}/book/${bookId}`);
  }
}