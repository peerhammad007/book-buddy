import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowRequest } from '../../../core/models/borrow.model';

@Component({
  selector: 'app-lender-requests',
  standalone: false,
  templateUrl: './lender-requests.component.html',
  styleUrls: ['./lender-requests.component.css']
})
export class LenderRequestsComponent implements OnInit {
  requests: BorrowRequest[] = [];
  loading = true;
  error = '';
  actionMessage = '';

  constructor(private borrowService: BorrowService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }
  fetchRequests(): void {
    this.loading = true;
    this.borrowService.getPendingRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load requests.';
        this.loading = false;
      }
    });
  }
  respond(requestId: string, status: 'approved' | 'rejected') {
    this.borrowService.respondToRequest(requestId, status).subscribe({
      next: () => {
        this.actionMessage = `Request ${status}.`;
        // Refresh the list to remove the item from pending requests
        this.fetchRequests();
      },
      error: (err) => {
        this.actionMessage = err.error?.message || `Failed to ${status} request.`;
      }
    });
  }
}