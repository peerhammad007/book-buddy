// frontend/src/app/core/services/book.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks(params?: any): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(data: FormData): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, data);
  }

  updateBook(id: string, data: FormData): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, data);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
