import { BookX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { useLibrary } from '../context/LibraryContext';
import type { AvailabilityFilter, BookCategory, SortOption } from '../types/library';
import { filterAndSortBooks } from '../utils/libraryLogic';

export function CatalogPage() {
  const { books, loans } = useLibrary();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<BookCategory | 'Todas'>('Todas');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState<SortOption>('title-asc');

  useEffect(() => {
    const paramQ = searchParams.get('q') ?? '';
    setQuery(paramQ);
  }, [searchParams]);

  const handleQueryChange = (nextValue: string) => {
    setQuery(nextValue);
    if (nextValue.trim()) {
      setSearchParams({ q: nextValue }, { replace: true });
    } else if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('Todas');
    setAvailability('all');
    setSort('title-asc');
    if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredBooks = useMemo(
    () =>
      filterAndSortBooks(books, loans, {
        query,
        category,
        availability,
        sort,
      }),
    [books, loans, query, category, availability, sort],
  );

  const hasActiveFilters =
    query.trim() !== '' || category !== 'Todas' || availability !== 'all';

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-[#18324B]">
          Catálogo general
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#315C78]">
          Explora los {books.length} títulos disponibles en el acervo digital de BiblioNexo. Filtra
          por género, disponibilidad o busca directamente por título y autor.
        </p>
      </header>

      <section
        aria-label="Herramientas de búsqueda y filtrado"
        className="space-y-4 rounded-xl border border-[#E2DDD0] bg-white p-5"
      >
        <SearchBar
          id="catalog-page-search"
          value={query}
          onChange={handleQueryChange}
          placeholder="Buscar por título o autor..."
          label="Buscar en el catálogo por título o autor"
        />

        <CategoryFilter
          selectedCategory={category}
          onSelectCategory={setCategory}
          availability={availability}
          onChangeAvailability={setAvailability}
          sort={sort}
          onChangeSort={setSort}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#315C78]" aria-live="polite">
          Mostrando{' '}
          <span className="font-semibold text-[#18324B] tabular-nums">
            {filteredBooks.length}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-[#18324B] tabular-nums">
            {books.length}
          </span>{' '}
          libros
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-[#18324B] underline underline-offset-4 hover:text-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {filteredBooks.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="No se encontraron libros con esos criterios"
          description="Prueba limpiando los filtros o buscando otro título, autor o categoría del catálogo."
          actionLabel="Mostrar todos los libros"
          onAction={resetFilters}
        />
      ) : (
        <div
          data-testid="catalog-grid"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
