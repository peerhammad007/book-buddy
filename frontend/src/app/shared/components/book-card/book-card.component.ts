import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../../core/models/book.model';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {
  @Input() book!: Book;
  backendUrl = environment.backendUrl;
  canEdit = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private bookService: BookService
  ) { }
  ngOnInit() {
    this.userService.user$.subscribe(user => {
      // User can edit if they are the book's owner
      this.canEdit = user?._id === this.book.ownerId._id;
    });
  }

  getImageUrl(): string {
    if (!this.book.image) {
      return 'assets/default-book.jpg';
    }
    // If the image path is already absolute, return as is
    if (this.book.image.startsWith('http')) {
      return this.book.image;
    }
    // Otherwise, prepend backend URL
    return `${this.backendUrl}/${this.book.image.replace(/\\/g, '/')}`;
  }

  viewDetails() {
    this.router.navigate(['/books', this.book._id]);
  }

  editBook() {
    this.router.navigate(['/books/edit', this.book._id]);
  }

  deleteBook() {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(this.book._id).subscribe({
        next: () => {
          // Emit an event or refresh the book list
          window.location.reload(); // This is temporary, should use proper state management
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          alert('Failed to delete book. Please try again.');
        }
      });
    }
  }
}
