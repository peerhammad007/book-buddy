import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BorrowService } from '../../../core/services/borrow.service';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { Location } from '@angular/common';

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
  minDate = new Date();
  maxDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private borrowService: BorrowService,
    private bookService: BookService,
    private router: Router,
    private location: Location
  ) {
    // Set max borrowing period to 30 days
    this.maxDate.setDate(this.maxDate.getDate() + 30);
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.loadBook();
  }

  private loadBook(): void {
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        if (book.availability === 'on-loan') {
          this.error = 'This book is currently not available for borrowing.';
          return;
        }
        this.book = book;
      },
      error: () => this.error = 'Failed to load book details.'
    });
  }

  requestBorrow(): void {
    if (!this.dueDate) {
      this.error = 'Please select a return date';
      return;
    }

    this.borrowService.requestBorrow({
      bookId: this.bookId,
      dueDate: this.dueDate
    }).subscribe({
      next: () => {
        this.message = 'Borrow request sent successfully!';
        this.error = '';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send borrow request.';
        this.message = '';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}