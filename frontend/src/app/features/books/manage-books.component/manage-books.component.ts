import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-books',
  standalone: false,
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.css']
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const userId = this.parseUserIdFromToken(token);
      this.bookService.getBooks({ ownerId: userId }).subscribe({
        next: (res) => {
          this.books = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load books.';
          this.loading = false;
        }
      });
    }
  }

  parseUserIdFromToken(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload._id;
  }

  editBook(bookId: string): void {
    this.router.navigate(['/books/edit', bookId]);
  }

  deleteBook(bookId: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.books = this.books.filter(book => book._id !== bookId);
        },
        error: () => {
          this.errorMessage = 'Failed to delete book.';
        }
      });
    }
  }
}
