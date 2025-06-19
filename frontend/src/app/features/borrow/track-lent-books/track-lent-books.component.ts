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
  filteredLentBorrows: BorrowRequest[] = [];
  loading = true;
  error = '';
  actionMessage = '';
  statusFilter: string = 'all';

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.fetchLentBorrows();
  }
  fetchLentBorrows(): void {
    this.loading = true;
    this.borrowService.getLentBooks().subscribe({
      next: (data) => {
        this.lentBorrows = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load lent books.';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter === 'all') {
      this.filteredLentBorrows = this.lentBorrows;
    } else {
      this.filteredLentBorrows = this.lentBorrows.filter(b => b.status === this.statusFilter);
    }
  }
  markAsReturned(requestId: string) {
    // Add confirmation dialog
    if (!confirm('Are you sure you want to mark this book as returned? This action cannot be undone.')) {
      return;
    }
    
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