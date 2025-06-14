import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {CommonModule} from '@angular/common';

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
import { ManageBooksComponent } from './features/books/manage-books.component/manage-books.component';
import { ListBooksComponent } from './features/books/list-books/list-books.component';
import { BookCardComponent } from './shared/components/book-card/book-card.component';
import { RequestBookComponent } from './features/borrow/request-book/request-book.component';
import { TrackBorrowsComponent } from './features/borrow/track-borrows/track-borrows.component';
import { LenderRequestsComponent } from './features/borrow/lender-requests/lender-requests.component';
import { TrackLentBooksComponent } from './features/borrow/track-lent-books/track-lent-books.component';
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
    TrackLentBooksComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
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
