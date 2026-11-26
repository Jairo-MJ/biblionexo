import {
  ArrowLeft,
  BookMarked,
  BookX,
  CheckCircle2,
  Clock,
  Heart,
  Info,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { BookCover } from '../components/BookCover';
import { EmptyState } from '../components/EmptyState';
import { useLibrary } from '../context/LibraryContext';
import { formatDateEs } from '../utils/libraryLogic';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getBookById,
    isFavorite,
    toggleFavorite,
    isBookAvailableNow,
    hasActiveLoan,
    requestLoan,
    loans,
  } = useLibrary();

  const book = id ? getBookById(id) : undefined;

  if (!book) {
    return (
      <div className="space-y-6">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#315C78] hover:text-[#18324B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Volver al catálogo</span>
        </Link>
        <EmptyState
          icon={BookX}
          title="Libro no encontrado"
          description="El identificador consultado no corresponde a ninguna obra registrada en BiblioNexo."
          actionLabel="Ir al catálogo"
          actionTo="/catalogo"
        />
      </div>
    );
  }

  const favorite = isFavorite(book.id);
  const available = isBookAvailableNow(book.id);
  const loanedByUser = hasActiveLoan(book.id);
  const activeLoan = loans.find((l) => l.bookId === book.id && l.status === 'Activo');

  const availabilityText = available
    ? 'Disponible para préstamo digital'
    : loanedByUser
      ? 'Actualmente en préstamo por ti'
      : 'No disponible (ejemplar en consulta especial)';

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/catalogo"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#315C78] transition-colors hover:text-[#18324B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Volver al catálogo</span>
        </Link>
      </div>

      <article className="rounded-xl border border-[#DFD9C9] bg-white p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* Portada destacada */}
          <div className="mx-auto w-full max-w-xs md:col-span-5 lg:col-span-4">
            <BookCover book={book} size="lg" className="shadow-md" />
          </div>

          {/* Información editorial */}
          <div className="space-y-6 md:col-span-7 lg:col-span-8">
            <div className="space-y-3 border-b border-[#EFEBE0] pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#315C78]">
                <span>{book.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Publicado en {book.year}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{book.catalogCode}</span>
              </div>

              <h1 className="font-serif text-3xl font-semibold leading-tight text-[#18324B] sm:text-4xl [text-wrap:balance]">
                {book.title}
              </h1>

              <p className="text-lg font-medium text-[#315C78]">{book.author}</p>

              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-2 text-sm font-semibold ${
                    available ? 'text-[#166534]' : 'text-[#9A3412]'
                  }`}
                >
                  {available ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{availabilityText}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#315C78]">
                Sinopsis editorial
              </h2>
              <p className="max-w-prose text-base leading-relaxed text-[#18324B]">
                {book.description}
              </p>
            </div>

            {/* Ficha técnica */}
            <dl className="grid grid-cols-2 gap-4 border-y border-[#EFEBE0] py-5 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-[#315C78]">Género</dt>
                <dd className="mt-1 text-sm font-semibold text-[#18324B]">{book.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#315C78]">Año</dt>
                <dd className="mt-1 text-sm font-semibold text-[#18324B] tabular-nums">
                  {book.year}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#315C78]">Extensión</dt>
                <dd className="mt-1 text-sm font-semibold text-[#18324B] tabular-nums">
                  {book.pages} páginas
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#315C78]">Idioma</dt>
                <dd className="mt-1 text-sm font-semibold text-[#18324B]">{book.language}</dd>
              </div>
            </dl>

            {/* Mensaje explicativo cuando no está disponible */}
            {!available && (
              <div
                role="note"
                className="flex items-start gap-3 rounded-lg border border-[#E6D5B3] bg-[#FAF6EC] p-4 text-sm text-[#18324B]"
              >
                <Info className="h-5 w-5 shrink-0 text-[#B6883B] mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  {loanedByUser && activeLoan ? (
                    <>
                      <p className="font-medium">
                        Ya cuentas con un préstamo activo para esta obra.
                      </p>
                      <p className="text-xs text-[#315C78]">
                        Fecha prevista de devolución:{' '}
                        <span className="font-semibold text-[#18324B] tabular-nums">
                          {formatDateEs(activeLoan.dueDate)}
                        </span>
                        . Puedes simular su devolución desde{' '}
                        <Link
                          to="/prestamos"
                          className="font-semibold text-[#18324B] underline underline-offset-4"
                        >
                          Mis préstamos
                        </Link>
                        .
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">
                        Este título no está disponible para préstamo en este momento.
                      </p>
                      <p className="text-xs text-[#315C78]">
                        Puedes guardarlo en tu lista de favoritos para consultarlo más adelante.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Acciones principales */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!available}
                onClick={() => requestLoan(book.id)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#18324B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#315C78] disabled:cursor-not-allowed disabled:bg-[#C6C0B2] disabled:text-[#5B564A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
              >
                <BookMarked className="h-4 w-4 text-[#D5A85B]" aria-hidden="true" />
                <span>
                  {available
                    ? 'Solicitar préstamo (14 días)'
                    : loanedByUser
                      ? 'Préstamo activo'
                      : 'No disponible'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(book.id)}
                aria-pressed={favorite}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] ${
                  favorite
                    ? 'border-[#D5A85B] bg-[#FAF6EC] text-[#18324B] hover:bg-[#F4ECDA]'
                    : 'border-[#D4CEC0] bg-white text-[#18324B] hover:bg-[#F4F1E8]'
                }`}
              >
                <Heart
                  className="h-4 w-4 text-[#B6883B]"
                  fill={favorite ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span>{favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
