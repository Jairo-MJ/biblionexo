import { BOOK_CATEGORIES } from '../data/books';
import type { AvailabilityFilter, BookCategory, SortOption } from '../types/library';

interface CategoryFilterProps {
  selectedCategory: BookCategory | 'Todas';
  onSelectCategory: (category: BookCategory | 'Todas') => void;
  availability: AvailabilityFilter;
  onChangeAvailability: (value: AvailabilityFilter) => void;
  sort: SortOption;
  onChangeSort: (value: SortOption) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  availability,
  onChangeAvailability,
  sort,
  onChangeSort,
}: CategoryFilterProps) {
  const categories: Array<BookCategory | 'Todas'> = ['Todas', ...BOOK_CATEGORIES];

  return (
    <div className="space-y-4">
      {/* Filtros de categoría */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por género">
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              aria-pressed={active}
              className={`min-h-10 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] ${
                active
                  ? 'bg-[#18324B] text-white'
                  : 'border border-[#DCD6C8] bg-white text-[#18324B] hover:bg-[#F4F1E8]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Controles secundarios: disponibilidad y ordenamiento */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#E5E0D3] pt-4">
        <div
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#EAE5D7] p-1"
          role="group"
          aria-label="Filtrar por disponibilidad"
        >
          {(
            [
              { value: 'all', label: 'Todos' },
              { value: 'available', label: 'Disponibles' },
              { value: 'loaned', label: 'No disponibles' },
            ] as const
          ).map((option) => {
            const active = availability === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeAvailability(option.value)}
                aria-pressed={active}
                className={`min-h-9 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] ${
                  active
                    ? 'bg-white text-[#18324B] shadow-xs'
                    : 'text-[#315C78] hover:text-[#18324B]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <label
            htmlFor="catalog-sort"
            className="text-xs font-medium text-[#315C78] whitespace-nowrap shrink-0"
          >
            Ordenar por
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => onChangeSort(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-[#D6D0C2] bg-white px-3 text-sm text-[#18324B] focus:border-[#18324B] focus:outline-none focus:ring-2 focus:ring-[#18324B]/15"
          >
            <option value="title-asc">Título (A - Z)</option>
            <option value="title-desc">Título (Z - A)</option>
            <option value="year-desc">Año (más recientes)</option>
            <option value="year-asc">Año (más antiguos)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
