import { Search, X } from 'lucide-react';
import type { FormEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  submitLabel?: string;
  id?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar por título o autor...',
  label = 'Buscar libros',
  submitLabel = 'Buscar',
  id = 'catalog-search',
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#315C78]"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-[#D6D0C2] bg-white pl-10 pr-10 text-sm text-[#18324B] placeholder:text-[#315C78]/70 transition-colors focus:border-[#18324B] focus:outline-none focus:ring-2 focus:ring-[#18324B]/15"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Limpiar búsqueda"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#315C78] hover:bg-[#F4F1E8] hover:text-[#18324B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {onSubmit && (
        <button
          type="submit"
          className="h-11 rounded-lg bg-[#18324B] px-5 text-sm font-medium text-white transition-colors hover:bg-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] whitespace-nowrap shrink-0"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
