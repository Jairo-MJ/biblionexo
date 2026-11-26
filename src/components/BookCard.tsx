import { ArrowUpRight, CheckCircle2, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import type { Book } from '../types/library';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { isFavorite, toggleFavorite, isBookAvailableNow, hasActiveLoan } = useLibrary();

  const favorite = isFavorite(book.id);
  const available = isBookAvailableNow(book.id);
  const loanedByUser = hasActiveLoan(book.id);

  const statusLabel = available
    ? 'Disponible'
    : loanedByUser
      ? 'En préstamo'
      : 'Consulta en sala';

  return (
    <article className="group flex flex-col rounded-xl border border-[#E2DDD0] bg-white p-4 transition-colors duration-200 hover:border-[#315C78]/50">
      <div className="relative">
        <Link
          to={`/libro/${book.id}`}
          aria-label={`Ver detalle de ${book.title}`}
          className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
        >
          <BookCover book={book} />
        </Link>

        <button
          type="button"
          onClick={() => toggleFavorite(book.id)}
          aria-label={
            favorite
              ? `Quitar "${book.title}" de favoritos`
              : `Agregar "${book.title}" a favoritos`
          }
          aria-pressed={favorite}
          className={`absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] ${
            favorite
              ? 'border-[#D5A85B] bg-[#18324B] text-[#D5A85B]'
              : 'border-[#DCD6C8] bg-white/95 text-[#315C78] hover:text-[#18324B]'
          }`}
        >
          <Heart
            className="h-4 w-4"
            fill={favorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#315C78]">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{book.year}</span>
          </div>

          <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-[#18324B] line-clamp-2">
            <Link
              to={`/libro/${book.id}`}
              className="hover:text-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
            >
              {book.title}
            </Link>
          </h3>

          <p className="mt-1 text-sm text-[#315C78] truncate">{book.author}</p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-[#EFEBE0] pt-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              available ? 'text-[#166534]' : 'text-[#9A3412]'
            }`}
          >
            {available ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{statusLabel}</span>
          </span>

          <Link
            to={`/libro/${book.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#18324B] hover:text-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            <span>Ver ficha</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
