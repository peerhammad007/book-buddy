export interface Rating {
  reviewerId: string;
  rating: number;
  comment?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isLender: boolean;
  profileImg?: string;
  bio?: string;
  ratings?: Rating[];
  token?: string; // Optional, used after login
}
