export interface BorrowRequest {
  _id: string;
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
  borrowerId: {
    _id: string;
    name: string;
  };
  lenderId: {
    _id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  dates: {
    requestDate?: string;
    dueDate?: string;
    returnDate?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}