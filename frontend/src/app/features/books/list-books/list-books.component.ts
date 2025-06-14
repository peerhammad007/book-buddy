import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { BorrowService } from '../../../core/services/borrow.service';

@Component({
  selector: 'app-list-books',
  standalone: false,
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {
  books: Book[] = [];
  isLoading = true;
  currentUserId: string | null = null;
  requestedBookIds = new Set<string>();

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router,
    private borrowService: BorrowService) {
  }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.isLoading = false;
      }
    });
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.id || payload._id;

      // Fetch borrow requests for this user
      this.borrowService.getBorrowHistory().subscribe({
        next: (requests) => {
          requests.forEach(req => {
            if (
              req.borrowerId._id === this.currentUserId &&
              (req.status === 'pending' || req.status === 'approved')
            ) {
              this.requestedBookIds.add(req.bookId._id);
            }
          });
        }
      });
    }
  }
  isBookOwner(book: Book): boolean {
    return book.ownerId && book.ownerId._id === this.currentUserId;
  }

  hasRequested(book: Book): boolean {
    return this.requestedBookIds.has(book._id);
  }

  openBorrowDialog(book: Book): void {
    // Navigate to the borrow/request-book component with the book ID
    this.router.navigate(['/borrow/request-book', book._id]);
  }

}
