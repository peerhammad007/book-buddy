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
  ) {}  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser._id) {
      this.bookService.getBooks().subscribe({
        next: (res) => {
          // Filter to only include books owned by the current user
          this.books = res.filter(book => 
            book.ownerId && book.ownerId._id === currentUser._id
          );
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load books.';
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'User authentication error';
      this.loading = false;
    }
  }  isBookOwner(book: Book): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && !!book.ownerId && book.ownerId._id === currentUser._id;
  }

  editBook(bookId: string): void {
    const book = this.books.find(b => b._id === bookId);
    if (book && this.isBookOwner(book)) {
      this.router.navigate(['/books/edit', bookId]);
    } else {
      this.errorMessage = 'You can only edit books that you own.';
    }
  }

  deleteBook(bookId: string): void {
    const book = this.books.find(b => b._id === bookId);
    if (!book || !this.isBookOwner(book)) {
      this.errorMessage = 'You can only delete books that you own.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.books = this.books.filter(book => book._id !== bookId);
          this.errorMessage = ''; // Clear any previous error
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete book.';
        }
      });
    }
  }
}
