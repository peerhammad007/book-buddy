import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AddBookComponent } from './features/books/add-book/add-book.component';
import { ManageBooksComponent } from './features/books/manage-books/manage-books.component';
import { AuthGuard } from './core/auth/auth.guard';
import { ListBooksComponent } from './features/books/list-books/list-books.component';
import { RequestBookComponent } from './features/borrow/request-book/request-book.component';
import { TrackBorrowsComponent } from './features/borrow/track-borrows/track-borrows.component';
import { LenderRequestsComponent } from './features/borrow/lender-requests/lender-requests.component';
import { TrackLentBooksComponent } from './features/borrow/track-lent-books/track-lent-books.component';
import { ProfileComponent } from './features/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'books/add', component: AddBookComponent, canActivate: [AuthGuard] },
  { path: 'books/manage', component: ManageBooksComponent, canActivate: [AuthGuard] },

  { path: 'books', component: ListBooksComponent, canActivate: [AuthGuard] },
  { path: 'borrow/request-book/:id', component: RequestBookComponent },
  { path: 'borrow/track-borrows', component: TrackBorrowsComponent },
  { path: 'borrow/lender-requests', component: LenderRequestsComponent },
  { path: 'borrow/track-lent-books', component: TrackLentBooksComponent },
  { path: 'books/edit/:id', component: AddBookComponent },
  { path: 'profile', component: ProfileComponent },


  // { path: 'books/:id', component: BookDetailComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
