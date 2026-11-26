import { BookCheck, BookMarked, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCover } from '../components/BookCover';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { useLibrary } from '../context/LibraryContext';
import type { Loan } from '../types/library';
import { formatDateEs } from '../utils/libraryLogic';

export function LoansPage() {
  const { loans, getBookById, returnLoan } = useLibrary();
  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);

  const activeLoans = loans.filter((loan) => loan.status === 'Activo');
  const pastLoans = loans.filter((loan) => loan.status === 'Devuelto');

  const bookPendingReturn = loanToReturn ? getBookById(loanToReturn.bookId) : undefined;

  const handleConfirmReturn = () => {
    if (!loanToReturn) return;
    returnLoan(loanToReturn.id);
    setLoanToReturn(null);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DFD9C9] pb-5">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-[#18324B]">
            Mis préstamos
          </h1>
          <p className="max-w-2xl text-sm text-[#315C78]">
            Administra tus préstamos simulados vigentes y consulta el historial de devoluciones.
            Cada préstamo se asigna con un plazo de 14 días.
          </p>
        </div>

        <Link
          to="/catalogo"
          className="inline-flex min-h-10 items-center rounded-lg bg-[#18324B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
        >
          Solicitar nuevo libro
        </Link>
      </header>

      {/* Préstamos activos */}
      <section aria-labelledby="active-loans-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="active-loans-heading"
            className="font-serif text-xl font-semibold text-[#18324B]"
          >
            Préstamos activos
          </h2>
          <span className="text-sm font-medium text-[#315C78] tabular-nums">
            {activeLoans.length} {activeLoans.length === 1 ? 'activo' : 'activos'}
          </span>
        </div>

        {activeLoans.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title="No tienes préstamos activos en este momento"
            description="Visita el catálogo para elegir un libro disponible y registrar un préstamo simulado de 14 días."
            actionLabel="Explorar catálogo"
            actionTo="/catalogo"
          />
        ) : (
          <div data-testid="active-loans-list" className="space-y-4">
            {activeLoans.map((loan) => {
              const book = getBookById(loan.bookId);
              if (!book) return null;

              return (
                <article
                  key={loan.id}
                  className="flex flex-col gap-5 rounded-xl border border-[#DFD9C9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <Link
                      to={`/libro/${book.id}`}
                      className="w-20 shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                      aria-label={`Ver detalle de ${book.title}`}
                    >
                      <BookCover book={book} size="sm" />
                    </Link>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#315C78]">
                        <span className="font-mono tabular-nums">{loan.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.category}</span>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#18324B]">
                        <Link
                          to={`/libro/${book.id}`}
                          className="hover:text-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                        >
                          {book.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-[#315C78]">{book.author}</p>

                      <dl className="flex flex-wrap gap-x-6 gap-y-1 pt-1 text-xs text-[#315C78]">
                        <div className="flex gap-1.5">
                          <dt className="font-medium text-[#18324B]">Solicitado:</dt>
                          <dd className="tabular-nums">{formatDateEs(loan.requestDate)}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="font-medium text-[#18324B]">Devolución prevista:</dt>
                          <dd className="font-semibold text-[#18324B] tabular-nums">
                            {formatDateEs(loan.dueDate)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EFEBE0] pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A3412]">
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Estado: {loan.status}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setLoanToReturn(loan)}
                      aria-label={`Devolver libro "${book.title}"`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#18324B] bg-white px-4 py-2 text-sm font-medium text-[#18324B] transition-colors hover:bg-[#18324B] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      <span>Devolver libro</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Préstamos anteriores */}
      <section aria-labelledby="past-loans-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="past-loans-heading"
            className="font-serif text-xl font-semibold text-[#18324B]"
          >
            Préstamos anteriores
          </h2>
          <span className="text-sm font-medium text-[#315C78] tabular-nums">
            {pastLoans.length} {pastLoans.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {pastLoans.length === 0 ? (
          <EmptyState
            icon={BookCheck}
            title="Aún no hay devoluciones registradas"
            description="Cuando devuelvas un libro prestado, el registro aparecerá aquí para tu seguimiento."
          />
        ) : (
          <div
            data-testid="past-loans-list"
            className="overflow-hidden rounded-xl border border-[#DFD9C9] bg-white"
          >
            <div className="divide-y divide-[#EFEBE0]">
              {pastLoans.map((loan) => {
                const book = getBookById(loan.bookId);
                if (!book) return null;

                return (
                  <article
                    key={loan.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#315C78]">
                        <span className="font-mono tabular-nums">{loan.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.category}</span>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#18324B]">
                        <Link
                          to={`/libro/${book.id}`}
                          className="hover:text-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
                        >
                          {book.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#315C78]">{book.author}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#315C78]">
                      <div className="tabular-nums">
                        <span className="text-[#315C78]">Solicitado: </span>
                        <span className="font-medium text-[#18324B]">
                          {formatDateEs(loan.requestDate)}
                        </span>
                      </div>
                      {loan.returnDate && (
                        <div className="tabular-nums">
                          <span className="text-[#315C78]">Devuelto: </span>
                          <span className="font-medium text-[#18324B]">
                            {formatDateEs(loan.returnDate)}
                          </span>
                        </div>
                      )}
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#166534]">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{loan.status}</span>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(loanToReturn)}
        title="Confirmar devolución simulada"
        description={
          bookPendingReturn
            ? `¿Deseas marcar como devuelto el libro "${bookPendingReturn.title}"? El título volverá a figurar como disponible en el catálogo.`
            : '¿Deseas confirmar la devolución de este préstamo?'
        }
        confirmLabel="Confirmar devolución"
        onConfirm={handleConfirmReturn}
        onCancel={() => setLoanToReturn(null)}
      />
    </div>
  );
}
