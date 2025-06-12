import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  bookForm: FormGroup;
  selectedImage: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private bookService: BookService, private router: Router) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [''],
      condition: ['']
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formData = new FormData();
      Object.entries(this.bookForm.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.bookService.createBook(formData).subscribe({
        next: () => {
          this.successMessage = 'Book added successfully!';
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Failed to add book.';
        }
      });
    }
  }
}
