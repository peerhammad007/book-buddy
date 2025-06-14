import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../../core/models/book.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
  backendUrl = environment.backendUrl;

  constructor(private router: Router) { }

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
}
