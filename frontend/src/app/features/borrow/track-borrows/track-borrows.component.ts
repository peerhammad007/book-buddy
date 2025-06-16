import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowRequest } from '../../../core/models/borrow.model';

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

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.loadBorrowHistory();
  }

  private loadBorrowHistory(): void {
    this.loading = true;
    this.error = '';
    
    this.borrowService.getBorrowHistory().subscribe({
      next: (data) => {
        this.borrows = data.filter(b => b.borrowerId);
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'hourglass_empty';
      case 'approved':
        return 'book';
      case 'rejected':
        return 'cancel';
      case 'returned':
        return 'assignment_turned_in';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'On Loan';
      case 'rejected':
        return 'Rejected';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  }
}