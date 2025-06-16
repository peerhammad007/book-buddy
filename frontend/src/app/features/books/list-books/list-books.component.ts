import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { BorrowService } from '../../../core/services/borrow.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-list-books',
  standalone: false,
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = true;
  currentUserId: string | null = null;
  requestedBookIds = new Set<string>();
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router,
    private borrowService: BorrowService,
    private dialog: MatDialog
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterBooks();
      });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUserBorrowRequests();
  }

  private loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filterBooks();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.isLoading = false;
      }
    });
  }

  private loadUserBorrowRequests(): void {
    if (this.currentUserId) {
      this.borrowService.getUserBorrowRequests().subscribe({
        next: (requests) => {
          this.requestedBookIds = new Set(
            requests.map(request => request.bookId._id)
          );
        },
        error: (error) => console.error('Error loading borrow requests:', error)
      });
    }
  }

  private filterBooks(): void {
    if (!this.searchQuery) {
      this.filteredBooks = this.books;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  isBookOwner(book: Book): boolean {
    return book.ownerId._id === this.currentUserId;
  }

  hasRequested(book: Book): boolean {
    return this.requestedBookIds.has(book._id);
  }

  openBorrowDialog(book: Book): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/borrow/request-book', book._id]);
  }
}
