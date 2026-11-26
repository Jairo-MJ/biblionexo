import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { EmptyState } from '../components/EmptyState';
import { useLibrary } from '../context/LibraryContext';
import type { Book } from '../types/library';

export function FavoritesPage() {
  const { favorites, getBookById } = useLibrary();

  const favoriteBooks = favorites
    .map((id) => getBookById(id))
    .filter((book): book is Book => Boolean(book));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DFD9C9] pb-5">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-[#18324B]">
            Mis favoritos
          </h1>
          <p className="text-sm text-[#315C78]">
            Títulos guardados para consulta rápida. Tu selección se conserva en este navegador.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[#315C78] tabular-nums">
            {favoriteBooks.length}{' '}
            {favoriteBooks.length === 1 ? 'libro guardado' : 'libros guardados'}
          </span>
          <Link
            to="/catalogo"
            className="inline-flex min-h-10 items-center rounded-lg border border-[#D4CEC0] bg-white px-4 py-2 text-sm font-medium text-[#18324B] transition-colors hover:bg-[#F4F1E8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            Explorar catálogo
          </Link>
        </div>
      </header>

      {favoriteBooks.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Tu lista de favoritos está vacía"
          description="Marca el ícono de corazón en cualquier libro del catálogo o desde su ficha editorial para tenerlo siempre a mano."
          actionLabel="Explorar catálogo"
          actionTo="/catalogo"
        />
      ) : (
        <div
          data-testid="favorites-grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
