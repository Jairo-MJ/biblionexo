import type { Loan, UserProfile } from '../types/library';
import { calculateDueDate, toISODateString } from '../utils/libraryLogic';

const STORAGE_KEYS = {
  favorites: 'biblionexo_favorites_v1',
  loans: 'biblionexo_loans_v1',
  profile: 'biblionexo_profile_v1',
} as const;

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Jairo José María Morales Jiménez',
  email: 'jairo.morales@alumnos.udg.mx',
  registeredAt: '2026-08-18',
};

export function createSeedFavorites(): string[] {
  return ['cien-anos-de-soledad', 'dune'];
}

export function createSeedLoans(): Loan[] {
  const today = new Date();
  const activeStartDate = new Date(today);
  activeStartDate.setDate(today.getDate() - 3);
  const activeStartISO = toISODateString(activeStartDate);

  const pastStartDate = new Date(today);
  pastStartDate.setDate(today.getDate() - 24);
  const pastStartISO = toISODateString(pastStartDate);

  const pastReturnDate = new Date(today);
  pastReturnDate.setDate(today.getDate() - 12);
  const pastReturnISO = toISODateString(pastReturnDate);

  return [
    {
      id: 'PR-2026-104',
      bookId: 'fundacion',
      requestDate: activeStartISO,
      dueDate: calculateDueDate(activeStartISO, 14),
      status: 'Activo',
    },
    {
      id: 'PR-2026-089',
      bookId: 'el-programador-pragmatico',
      requestDate: pastStartISO,
      dueDate: calculateDueDate(pastStartISO, 14),
      returnDate: pastReturnISO,
      status: 'Devuelto',
    },
  ];
}

function safeReadStorage<T>(key: string, createFallback: () => T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      const initial = createFallback();
      window.localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) as T;
  } catch {
    return createFallback();
  }
}

function safeWriteStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignorar error de cuota si el navegador restringe almacenamiento
  }
}

export const storageService = {
  getFavorites(): string[] {
    const parsed = safeReadStorage<unknown>(STORAGE_KEYS.favorites, createSeedFavorites);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  },

  saveFavorites(favorites: string[]): void {
    safeWriteStorage(STORAGE_KEYS.favorites, favorites);
  },

  getLoans(): Loan[] {
    const parsed = safeReadStorage<unknown>(STORAGE_KEYS.loans, createSeedLoans);
    return Array.isArray(parsed) ? (parsed as Loan[]) : [];
  },

  saveLoans(loans: Loan[]): void {
    safeWriteStorage(STORAGE_KEYS.loans, loans);
  },

  getProfile(): UserProfile {
    const parsed = safeReadStorage<Partial<UserProfile>>(STORAGE_KEYS.profile, () => DEFAULT_PROFILE);
    if (!parsed || typeof parsed.name !== 'string' || typeof parsed.email !== 'string') {
      return DEFAULT_PROFILE;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      registeredAt: parsed.registeredAt ?? DEFAULT_PROFILE.registeredAt,
    };
  },

  saveProfile(profile: UserProfile): void {
    safeWriteStorage(STORAGE_KEYS.profile, profile);
  },
};
