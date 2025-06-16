import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { AppRoutingModule } from './app-routing-module';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TokenInterceptor } from './core/auth/token.interceptor';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AddBookComponent } from './features/books/add-book/add-book.component';
import { ManageBooksComponent } from './features/books/manage-books/manage-books.component';
import { ListBooksComponent } from './features/books/list-books/list-books.component';
import { BookCardComponent } from './shared/components/book-card/book-card.component';
import { RequestBookComponent } from './features/borrow/request-book/request-book.component';
import { TrackBorrowsComponent } from './features/borrow/track-borrows/track-borrows.component';
import { LenderRequestsComponent } from './features/borrow/lender-requests/lender-requests.component';
import { TrackLentBooksComponent } from './features/borrow/track-lent-books/track-lent-books.component';
import { ProfileComponent } from './features/profile/profile.component';
@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    NavbarComponent,
    AddBookComponent,
    ManageBooksComponent,
    ListBooksComponent,
    BookCardComponent,
    RequestBookComponent,
    TrackBorrowsComponent,
    LenderRequestsComponent,
    TrackLentBooksComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }

  ],
  bootstrap: [App]
})
export class AppModule { }
