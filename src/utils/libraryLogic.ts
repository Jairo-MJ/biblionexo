import type {
  AvailabilityFilter,
  Book,
  BookCategory,
  Loan,
  SortOption,
} from '../types/library';

export const LOAN_DURATION_DAYS = 14;

/**
 * Formats a Date object as YYYY-MM-DD in local calendar coordinates.
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds a specific number of calendar days to an ISO date string (YYYY-MM-DD)
 * without timezone drift.
 */
export function calculateDueDate(requestDateISO: string, days = LOAN_DURATION_DAYS): string {
  const [year, month, day] = requestDateISO.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error(`Fecha inválida: ${requestDateISO}`);
  }
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const SPANISH_MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export function formatDateEs(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const monthLabel = SPANISH_MONTHS[month - 1] ?? '';
  return `${day} ${monthLabel} ${year}`;
}

export function hasActiveLoanForBook(bookId: string, loans: Loan[]): boolean {
  return loans.some((loan) => loan.bookId === bookId && loan.status === 'Activo');
}

export function isBookAvailable(book: Book, loans: Loan[]): boolean {
  if (!book.initialAvailable) {
    return false;
  }
  return !hasActiveLoanForBook(book.id, loans);
}

export function createLoanRecord(
  book: Book,
  loans: Loan[],
  requestDateISO: string,
  loanId?: string,
): { ok: true; loan: Loan } | { ok: false; error: string } {
  if (hasActiveLoanForBook(book.id, loans)) {
    return {
      ok: false,
      error: 'Ya tienes un préstamo activo para este libro.',
    };
  }

  if (!book.initialAvailable) {
    return {
      ok: false,
      error: 'Este libro no está disponible para préstamo en este momento.',
    };
  }

  const generatedId =
    loanId ?? `PR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  const loan: Loan = {
    id: generatedId,
    bookId: book.id,
    requestDate: requestDateISO,
    dueDate: calculateDueDate(requestDateISO, LOAN_DURATION_DAYS),
    status: 'Activo',
  };

  return { ok: true, loan };
}

export function returnLoanRecord(
  loanId: string,
  loans: Loan[],
  returnDateISO: string,
): { ok: true; loans: Loan[]; returnedLoan: Loan } | { ok: false; error: string } {
  const target = loans.find((item) => item.id === loanId);
  if (!target) {
    return { ok: false, error: 'No se encontró el préstamo seleccionado.' };
  }
  if (target.status === 'Devuelto') {
    return { ok: false, error: 'Este préstamo ya fue marcado como devuelto.' };
  }

  const returnedLoan: Loan = {
    ...target,
    status: 'Devuelto',
    returnDate: returnDateISO,
  };

  const updatedLoans = loans.map((item) => (item.id === loanId ? returnedLoan : item));
  return { ok: true, loans: updatedLoans, returnedLoan };
}

export interface FilterBooksOptions {
  query: string;
  category: BookCategory | 'Todas';
  availability: AvailabilityFilter;
  sort: SortOption;
}

export function filterAndSortBooks(
  books: Book[],
  loans: Loan[],
  options: FilterBooksOptions,
): Book[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  const filtered = books.filter((book) => {
    const matchesQuery =
      normalizedQuery === '' ||
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery);

    if (!matchesQuery) {
      return false;
    }

    if (options.category !== 'Todas' && book.category !== options.category) {
      return false;
    }

    const available = isBookAvailable(book, loans);
    if (options.availability === 'available' && !available) {
      return false;
    }
    if (options.availability === 'loaned' && available) {
      return false;
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (options.sort) {
      case 'title-asc':
        return a.title.localeCompare(b.title, 'es');
      case 'title-desc':
        return b.title.localeCompare(a.title, 'es');
      case 'year-desc':
        return b.year - a.year || a.title.localeCompare(b.title, 'es');
      case 'year-asc':
        return a.year - b.year || a.title.localeCompare(b.title, 'es');
    }
  });
}

export function validateProfileInput(
  name: string,
  email: string,
): { valid: boolean; errors: { name?: string; email?: string } } {
  const errors: { name?: string; email?: string } = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    errors.name = 'El nombre completo es obligatorio.';
  } else if (trimmedName.length < 3) {
    errors.name = 'Ingresa un nombre de al menos 3 caracteres.';
  } else if (trimmedName.length > 80) {
    errors.name = 'El nombre no puede superar los 80 caracteres.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!trimmedEmail) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Ingresa un correo electrónico válido (ejemplo: usuario@udg.mx).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
