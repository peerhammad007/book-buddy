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
  loading = true;
  error = '';

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.borrowService.getBorrowHistory().subscribe({
      next: (data) => {
        // Only show borrows where the user is the borrower
        this.borrows = this.borrows = data.filter(b => b.borrowerId);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load borrow history.';
        this.loading = false;
      }
    });
  }
}