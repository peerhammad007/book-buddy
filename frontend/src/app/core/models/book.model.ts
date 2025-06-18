export interface Book {
  _id: string;
  title: string;
  author: string;
  genre?: string;
  condition?: string;
  description?: string;
  ownerId: {
    _id: string;
    name: string;
  };
  image?: string;
  availability: 'available' | 'on-loan';
  createdAt?: string;
  updatedAt?: string;
}
