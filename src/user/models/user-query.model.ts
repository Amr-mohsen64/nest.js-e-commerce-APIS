export interface UserQuery {
  limit: number;
  page: number;
  sort: 'asc' | 'desc';
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}