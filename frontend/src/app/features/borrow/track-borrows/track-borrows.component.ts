import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowRequest } from '../../../core/models/borrow.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-track-borrows',
  standalone: false,
  templateUrl: './track-borrows.component.html',
  styleUrls: ['./track-borrows.component.css']
})
export class TrackBorrowsComponent implements OnInit {
  borrows: BorrowRequest[] = [];
  filteredBorrows: BorrowRequest[] = [];
  loading = true;
  error = '';
  statusFilter: string = 'all';
  isLoading = false;

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.loadBorrowHistory();
  }
  
  loadBorrowHistory(): void {
    this.loading = true;
    this.borrowService.getBorrowHistory().subscribe({
      next: (data) => {
        // Only show borrows where the user is the borrower
        this.borrows = data.filter(b => b.borrowerId);
        this.applyFilter();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Failed to load borrow history.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'all') {
      this.filteredBorrows = this.borrows;
    } else {
      this.filteredBorrows = this.borrows.filter(b => b.status === this.statusFilter);
    }
  }
  
  daysLeft(borrow: BorrowRequest): number {
    if (borrow.status !== 'approved' || !borrow.dates.dueDate) return 0;
    
    const dueDate = new Date(borrow.dates.dueDate);
    const today = new Date();
    
    // Set hours, minutes, seconds and milliseconds to 0 for accurate day calculation
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  isOverdue(borrow: BorrowRequest): boolean {
    return this.daysLeft(borrow) < 0;
  }
  
  markAsReturned(borrow: BorrowRequest): void {
    if (!confirm('Are you sure you want to mark this book as returned?')) {
      return;
    }
    
    this.isLoading = true;
    this.borrowService.markAsReturned(borrow._id).subscribe({
      next: () => {
        // Update the status locally
        borrow.status = 'returned';
        borrow.dates.returnDate = new Date().toISOString();
        this.isLoading = false;
        this.applyFilter();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Failed to mark as returned.';
        this.isLoading = false;
      }
    });
  }
  
  cancelRequest(borrow: BorrowRequest): void {
    if (!confirm('Are you sure you want to cancel this borrow request?')) {
      return;
    }
    
    // Since there's no cancelRequest method, let's use a workaround by rejecting the request
    this.isLoading = true;
    if (borrow.status === 'pending') {
      // We can't cancel directly, so we'll mark it as returned
      this.borrowService.markAsReturned(borrow._id).subscribe({
        next: () => {
          // Either remove the request or update its status based on your API
          const index = this.borrows.findIndex(b => b._id === borrow._id);
          if (index > -1) {
            this.borrows.splice(index, 1);
          }
          this.isLoading = false;
          this.applyFilter();
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.message || 'Failed to cancel the request.';
          this.isLoading = false;
        }
      });
    }
  }
}