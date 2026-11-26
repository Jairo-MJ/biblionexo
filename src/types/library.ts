export type BookCategory =
  | 'Ciencia ficción'
  | 'Fantasía'
  | 'Misterio'
  | 'Historia'
  | 'Tecnología'
  | 'Literatura clásica';

export type JacketMotif = 'orbit' | 'arch' | 'botanical' | 'compass' | 'lattice' | 'quill';

export interface CoverEdition {
  bg: string;
  spine: string;
  accent: string;
  motif: JacketMotif;
}

export interface Book {
  id: string;
  catalogCode: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  coverEdition: CoverEdition;
  category: BookCategory;
  year: number;
  pages: number;
  language: string;
  featured?: boolean;
  isNew?: boolean;
  initialAvailable: boolean;
}

export type LoanStatus = 'Activo' | 'Devuelto';

export interface Loan {
  id: string;
  bookId: string;
  requestDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
}

export interface UserProfile {
  name: string;
  email: string;
  registeredAt: string;
}

export type SortOption = 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc';

export type AvailabilityFilter = 'all' | 'available' | 'loaned';

export interface FeedbackMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
