import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  bookForm: FormGroup;
  selectedImage: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;
  bookId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: [''],
      condition: ['']
    });
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookId;

    if (this.isEditMode && this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book: Book) => {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            genre: book.genre,
            condition: book.condition
          });
        },
        error: () => {
          this.errorMessage = 'Failed to load book details.';
        }
      });
    }
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

      if (this.isEditMode && this.bookId) {
        this.bookService.updateBook(this.bookId, formData).subscribe({
          next: () => {
            this.successMessage = 'Book updated successfully!';
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.errorMessage = err.error.message || 'Failed to update book.';
          }
        });
      } else {
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
}