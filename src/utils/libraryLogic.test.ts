import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_BOOKS } from '../data/books';
import {
  calculateDueDate,
  createLoanRecord,
  filterAndSortBooks,
  formatDateEs,
  isBookAvailable,
  returnLoanRecord,
  validateProfileInput,
} from './libraryLogic';
import type { Loan } from '../types/library';

test('calculateDueDate adds 14 days cleanly across month boundaries', () => {
  assert.equal(calculateDueDate('2026-11-20', 14), '2026-12-04');
  assert.equal(calculateDueDate('2026-02-20', 14), '2026-03-06');
});

test('isBookAvailable reflects active loans and initial availability', () => {
  const dune = INITIAL_BOOKS.find((b) => b.id === 'dune')!;
  const pedro = INITIAL_BOOKS.find((b) => b.id === 'pedro-paramo')!;

  const activeLoan: Loan = {
    id: 'PR-1',
    bookId: 'dune',
    requestDate: '2026-11-26',
    dueDate: '2026-12-10',
    status: 'Activo',
  };

  assert.equal(isBookAvailable(dune, []), true);
  assert.equal(isBookAvailable(dune, [activeLoan]), false);
  assert.equal(isBookAvailable(pedro, []), false);
});

test('createLoanRecord enforces 14-day due date and blocks duplicate or unavailable books', () => {
  const dune = INITIAL_BOOKS.find((b) => b.id === 'dune')!;
  const pedro = INITIAL_BOOKS.find((b) => b.id === 'pedro-paramo')!;

  const created = createLoanRecord(dune, [], '2026-11-26', 'PR-TEST-1');
  assert.equal(created.ok, true);
  if (created.ok) {
    assert.equal(created.loan.dueDate, '2026-12-10');
    assert.equal(created.loan.status, 'Activo');

    const duplicate = createLoanRecord(dune, [created.loan], '2026-11-26');
    assert.equal(duplicate.ok, false);
  }

  const unavailable = createLoanRecord(pedro, [], '2026-11-26');
  assert.equal(unavailable.ok, false);
});

test('returnLoanRecord transitions loan to Devuelto and restores availability', () => {
  const dune = INITIAL_BOOKS.find((b) => b.id === 'dune')!;
  const activeLoan: Loan = {
    id: 'PR-10',
    bookId: 'dune',
    requestDate: '2026-11-20',
    dueDate: '2026-12-04',
    status: 'Activo',
  };

  assert.equal(isBookAvailable(dune, [activeLoan]), false);
  const res = returnLoanRecord('PR-10', [activeLoan], '2026-11-26');
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.returnedLoan.status, 'Devuelto');
    assert.equal(res.returnedLoan.returnDate, '2026-11-26');
    assert.equal(isBookAvailable(dune, res.loans), true);
  }
});

test('filterAndSortBooks filters by query, category, availability and sorts accurately', () => {
  const loans: Loan[] = [
    {
      id: 'PR-1',
      bookId: 'fundacion',
      requestDate: '2026-11-20',
      dueDate: '2026-12-04',
      status: 'Activo',
    },
  ];

  const scifiAvailable = filterAndSortBooks(INITIAL_BOOKS, loans, {
    query: '',
    category: 'Ciencia ficción',
    availability: 'available',
    sort: 'year-desc',
  });

  assert.deepEqual(
    scifiAvailable.map((b) => b.id),
    ['neuromante', 'dune'],
  );

  const authorSearch = filterAndSortBooks(INITIAL_BOOKS, loans, {
    query: 'cervantes',
    category: 'Todas',
    availability: 'all',
    sort: 'title-asc',
  });
  assert.equal(authorSearch.length, 1);
  assert.equal(authorSearch[0].id, 'don-quijote');
});

test('validateProfileInput rejects empty/invalid inputs and accepts valid data', () => {
  const bad = validateProfileInput('A', 'not-an-email');
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.email);

  const good = validateProfileInput('Jairo Morales', 'jairo.morales@alumnos.udg.mx');
  assert.equal(good.valid, true);
  assert.deepEqual(good.errors, {});
});

test('formatDateEs formats ISO date cleanly', () => {
  assert.equal(formatDateEs('2026-11-26'), '26 nov 2026');
});
