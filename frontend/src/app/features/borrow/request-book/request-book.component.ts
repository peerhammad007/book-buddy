import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BorrowService } from '../../../core/services/borrow.service';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-request-book',
  standalone: false,
  templateUrl: './request-book.component.html',
  styleUrls: ['./request-book.component.css']
})
export class RequestBookComponent implements OnInit {
  bookId!: string;
  book?: Book;
  dueDate: string = '';
  message: string = '';
  error: string = '';
  loading = true;
  backendUrl = environment.backendUrl;

  constructor(
    private route: ActivatedRoute,
    private borrowService: BorrowService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load book details.';
        this.loading = false;
      }
    });
  }

  getImageUrl(): string {
    if (!this.book?.image) {
      return 'assets/default-book.jpg';
    }
    // If the image path is already absolute, return as is
    if (this.book.image.startsWith('http')) {
      return this.book.image;
    }
    // Otherwise, prepend backend URL
    return `${this.backendUrl}/${this.book.image.replace(/\\/g, '/')}`;
  }

  requestBorrow(): void {
    this.borrowService.requestBorrow({ bookId: this.bookId, dueDate: this.dueDate }).subscribe({
      next: () => {
        this.message = 'Borrow request sent!';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send borrow request.';
      }
    });
  }
}