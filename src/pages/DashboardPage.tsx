import { ArrowRight, BookCheck, BookMarked, Heart, Library } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { StatCard } from '../components/StatCard';
import { useLibrary } from '../context/LibraryContext';

export function DashboardPage() {
  const { books, favorites, loans, profile, isBookAvailableNow } = useLibrary();
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const firstName = profile.name.trim().split(/\s+/)[0] || 'Lector';
  const activeLoansCount = loans.filter((l) => l.status === 'Activo').length;
  const returnedLoansCount = loans.filter((l) => l.status === 'Devuelto').length;
  const availableCount = books.filter((b) => isBookAvailableNow(b.id)).length;

  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);
  const newBooks = books.filter((b) => b.isNew).slice(0, 4);

  const handleQuickSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/catalogo?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/catalogo');
    }
  };

  return (
    <div className="space-y-12">
      {/* Encabezado editorial y bienvenida */}
      <section className="overflow-hidden rounded-xl border border-[#DFD9C9] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#315C78]">
                Biblioteca digital universitaria
              </p>
              <h1 className="font-serif text-3xl font-semibold leading-tight text-[#18324B] sm:text-4xl [text-wrap:balance]">
                Bienvenido de vuelta, {firstName}. Explora lecturas esenciales y administra tus préstamos.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-[#315C78]">
                Consulta el acervo digital curado de BiblioNexo, guarda tus títulos de referencia en
                favoritos y gestiona préstamos simulados de 14 días desde cualquier dispositivo.
              </p>
            </div>

            <div className="space-y-4">
              <SearchBar
                id="dashboard-quick-search"
                value={quickQuery}
                onChange={setQuickQuery}
                onSubmit={handleQuickSearch}
                label="Búsqueda rápida en el catálogo"
                placeholder="Buscar por título o autor..."
                submitLabel="Buscar"
              />

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/catalogo"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#18324B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                >
                  <Library className="h-4 w-4 text-[#D5A85B]" aria-hidden="true" />
                  <span>Explorar catálogo</span>
                </Link>
                <Link
                  to="/prestamos"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D4CEC0] bg-[#F4F1E8] px-4 py-2 text-sm font-medium text-[#18324B] transition-colors hover:bg-[#EAE5D7] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                >
                  <BookMarked className="h-4 w-4 text-[#315C78]" aria-hidden="true" />
                  <span>Ver mis préstamos</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-60 bg-[#18324B] lg:col-span-5">
            <img
              src="/src/assets/images/hero_biblionexo_library_1795729684872.jpg"
              alt="Sala de lectura de la biblioteca digital BiblioNexo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover lg:h-full"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18324B]/70 via-[#18324B]/15 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D5A85B]">
                Acervo digital curado
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {books.length} obras seleccionadas en 6 áreas temáticas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas con estadísticas de préstamos activos y favoritos */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Resumen de actividad
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Préstamos activos"
            value={activeLoansCount}
            hint="Plazo de 14 días"
            icon={BookMarked}
            to="/prestamos"
            actionLabel="Gestionar"
          />
          <StatCard
            label="Mis favoritos"
            value={favorites.length}
            hint="Títulos guardados"
            icon={Heart}
            to="/favoritos"
            actionLabel="Ver lista"
          />
          <StatCard
            label="Títulos disponibles"
            value={availableCount}
            hint={`De ${books.length} en catálogo`}
            icon={Library}
            to="/catalogo"
            actionLabel="Explorar"
          />
          <StatCard
            label="Préstamos devueltos"
            value={returnedLoansCount}
            hint="Historial de lectura"
            icon={BookCheck}
            to="/prestamos"
            actionLabel="Historial"
          />
        </div>
      </section>

      {/* Libros destacados */}
      <section aria-labelledby="featured-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DFD9C9] pb-3">
          <div>
            <h2
              id="featured-heading"
              className="font-serif text-2xl font-semibold text-[#18324B]"
            >
              Libros destacados
            </h2>
            <p className="mt-1 text-sm text-[#315C78]">
              Obras imprescindibles recomendadas por su valor literario, histórico y formativo.
            </p>
          </div>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#18324B] hover:text-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Novedades */}
      <section aria-labelledby="new-releases-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DFD9C9] pb-3">
          <div>
            <h2
              id="new-releases-heading"
              className="font-serif text-2xl font-semibold text-[#18324B]"
            >
              Novedades del acervo
            </h2>
            <p className="mt-1 text-sm text-[#315C78]">
              Incorporaciones recientes en tecnología, ensayo histórico, ciencia ficción y misterio.
            </p>
          </div>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#18324B] hover:text-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            <span>Explorar novedades</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {newBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
