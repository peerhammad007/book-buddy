import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { Router } from '@angular/router';
import { BorrowService } from '../../../core/services/borrow.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-list-books',
  standalone: false,
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {
  books: Book[] = [];
  allBooks: Book[] = []; // Store all books for filtering
  isLoading = true; currentUserId: string | null = null;
  requestedBookIds = new Set<string>();
  isLender = true; // All users are now lenders by default

  // New properties for filters
  searchTerm = '';
  selectedGenre = '';
  sortOption = 'newest';
  genres: string[] = [];

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private router: Router,
    private borrowService: BorrowService) {
  }

  ngOnInit(): void { 

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.allBooks = data;
        this.books = [...data];
        this.isLoading = false;

        // Extract unique genres
        const genreSet = new Set<string>();
        this.allBooks.forEach(book => {
          if (book.genre) {
            genreSet.add(book.genre);
          }
        });
        this.genres = Array.from(genreSet).sort();
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.isLoading = false;
      }
    });
    // Get current user
    const user = this.userService.getCurrentUser();
    if (user) {
      this.currentUserId = user._id;      

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

  // Filter books based on search term and genre
  filterBooks(): void {
    let filteredBooks = [...this.allBooks];

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.trim().toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
      );
    }

    if (this.selectedGenre) {
      filteredBooks = filteredBooks.filter(book => book.genre === this.selectedGenre);
    }

    this.books = filteredBooks;
    this.sortBooks();
  }

  // Sort books based on selected option
  sortBooks(): void {
    switch (this.sortOption) {
      case 'newest':
        this.books.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'title-asc':
        this.books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        this.books.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'author-asc':
        this.books.sort((a, b) => a.author.localeCompare(b.author));
        break;
    }
  }
}
