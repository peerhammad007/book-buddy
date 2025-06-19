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
    this.borrowService.getMyBorrows().subscribe({
      next: (data) => {
        this.borrows = data;
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
  
  cancelRequest(borrow: BorrowRequest): void {
    // This is a placeholder for future implementation
    this.error = "Canceling requests is not implemented yet.";
    // In a real implementation, you would call an API endpoint to cancel the request
    // For now, we'll just inform the user that this functionality isn't implemented
  }
}