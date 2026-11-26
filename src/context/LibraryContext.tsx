import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { INITIAL_BOOKS } from '../data/books';
import { storageService } from '../services/storageService';
import type { Book, FeedbackMessage, Loan, UserProfile } from '../types/library';
import {
  createLoanRecord,
  hasActiveLoanForBook,
  isBookAvailable,
  returnLoanRecord,
  toISODateString,
} from '../utils/libraryLogic';

interface LibraryContextValue {
  books: Book[];
  favorites: string[];
  loans: Loan[];
  profile: UserProfile;
  feedback: FeedbackMessage | null;
  dismissFeedback: () => void;
  showFeedback: (type: FeedbackMessage['type'], text: string) => void;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => void;
  isBookAvailableNow: (bookId: string) => boolean;
  hasActiveLoan: (bookId: string) => boolean;
  requestLoan: (bookId: string) => boolean;
  returnLoan: (loanId: string) => boolean;
  updateProfile: (nextProfile: Pick<UserProfile, 'name' | 'email'>) => void;
  getBookById: (bookId: string) => Book | undefined;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [loans, setLoans] = useState<Loan[]>(() => storageService.getLoans());
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  useEffect(() => {
    storageService.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    storageService.saveLoans(loans);
  }, [loans]);

  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const showFeedback = useCallback((type: FeedbackMessage['type'], text: string) => {
    setFeedback({
      id: String(Date.now()),
      type,
      text,
    });
  }, []);

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const getBookById = useCallback(
    (bookId: string) => INITIAL_BOOKS.find((b) => b.id === bookId),
    [],
  );

  const isFavorite = useCallback(
    (bookId: string) => favorites.includes(bookId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (bookId: string) => {
      const book = getBookById(bookId);
      setFavorites((prev) => {
        const exists = prev.includes(bookId);
        const next = exists ? prev.filter((id) => id !== bookId) : [...prev, bookId];
        if (book) {
          showFeedback(
            exists ? 'info' : 'success',
            exists
              ? `"${book.title}" se eliminó de tus favoritos.`
              : `"${book.title}" se guardó en tus favoritos.`,
          );
        }
        return next;
      });
    },
    [getBookById, showFeedback],
  );

  const hasActiveLoan = useCallback(
    (bookId: string) => hasActiveLoanForBook(bookId, loans),
    [loans],
  );

  const isBookAvailableNow = useCallback(
    (bookId: string) => {
      const book = getBookById(bookId);
      if (!book) return false;
      return isBookAvailable(book, loans);
    },
    [getBookById, loans],
  );

  const requestLoan = useCallback(
    (bookId: string): boolean => {
      const book = getBookById(bookId);
      if (!book) {
        showFeedback('error', 'No se encontró el libro solicitado.');
        return false;
      }

      const todayISO = toISODateString(new Date());
      const result = createLoanRecord(book, loans, todayISO);
      if (!result.ok) {
        showFeedback('error', result.error);
        return false;
      }

      setLoans((prev) => [result.loan, ...prev]);
      showFeedback(
        'success',
        `Préstamo simulado registrado para "${book.title}". Devolución prevista en 14 días.`,
      );
      return true;
    },
    [getBookById, loans, showFeedback],
  );

  const returnLoan = useCallback(
    (loanId: string): boolean => {
      const todayISO = toISODateString(new Date());
      const result = returnLoanRecord(loanId, loans, todayISO);
      if (!result.ok) {
        showFeedback('error', result.error);
        return false;
      }

      const book = getBookById(result.returnedLoan.bookId);
      setLoans(result.loans);
      showFeedback(
        'success',
        book
          ? `Devolución registrada para "${book.title}". El libro vuelve a estar disponible.`
          : 'Devolución registrada correctamente.',
      );
      return true;
    },
    [getBookById, loans, showFeedback],
  );

  const updateProfile = useCallback(
    (nextProfile: Pick<UserProfile, 'name' | 'email'>) => {
      setProfile((prev) => ({
        ...prev,
        name: nextProfile.name.trim(),
        email: nextProfile.email.trim(),
      }));
      showFeedback('success', 'Tus datos de perfil se guardaron en el navegador.');
    },
    [showFeedback],
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      books: INITIAL_BOOKS,
      favorites,
      loans,
      profile,
      feedback,
      dismissFeedback,
      showFeedback,
      isFavorite,
      toggleFavorite,
      isBookAvailableNow,
      hasActiveLoan,
      requestLoan,
      returnLoan,
      updateProfile,
      getBookById,
    }),
    [
      favorites,
      loans,
      profile,
      feedback,
      dismissFeedback,
      showFeedback,
      isFavorite,
      toggleFavorite,
      isBookAvailableNow,
      hasActiveLoan,
      requestLoan,
      returnLoan,
      updateProfile,
      getBookById,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary debe utilizarse dentro de LibraryProvider');
  }
  return ctx;
}
