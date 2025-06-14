import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowRequest } from '../../../core/models/borrow.model';

@Component({
  selector: 'app-track-lent-books',
  standalone: false,
  templateUrl: './track-lent-books.component.html',
  styleUrls: ['./track-lent-books.component.css']
})
export class TrackLentBooksComponent implements OnInit {
  lentBorrows: BorrowRequest[] = [];
  loading = true;
  error = '';
  actionMessage = '';

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.fetchLentBorrows();
  }

  fetchLentBorrows(): void {
    this.loading = true;
    this.borrowService.getBorrowHistory().subscribe({
      next: (data) => {
        // Only show borrows where the user is the lender and not returned
        this.lentBorrows = data.filter(
          b => b.lenderId
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load lent books.';
        this.loading = false;
      }
    });
  }

  markAsReturned(requestId: string) {
    this.borrowService.markAsReturned(requestId).subscribe({
      next: () => {
        this.actionMessage = 'Book marked as returned!';
        this.fetchLentBorrows();
      },
      error: (err) => {
        this.actionMessage = err.error?.message || 'Failed to mark as returned.';
      }
    });
  }
}