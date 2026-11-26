import { Menu, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

function getSectionTitle(pathname: string): string {
  if (pathname === '/') return 'Inicio';
  if (pathname.startsWith('/catalogo')) return 'Catálogo de libros';
  if (pathname.startsWith('/libro/')) return 'Detalle del libro';
  if (pathname.startsWith('/favoritos')) return 'Mis favoritos';
  if (pathname.startsWith('/prestamos')) return 'Mis préstamos';
  if (pathname.startsWith('/perfil')) return 'Mi perfil';
  return 'BiblioNexo';
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { pathname } = useLocation();
  const { profile } = useLibrary();

  const sectionTitle = getSectionTitle(pathname);
  const firstName = profile.name.trim().split(/\s+/)[0] || 'Lector';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#E2DDD0] bg-[#FFFFFF]/95 px-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú de navegación"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2DDD0] bg-white text-[#18324B] hover:bg-[#F4F1E8] lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="font-serif text-base font-semibold text-[#18324B] lg:hidden whitespace-nowrap">
            BiblioNexo
          </span>
          <span className="text-[#D5A85B] lg:hidden" aria-hidden="true">
            /
          </span>
          <p className="text-sm font-medium text-[#315C78] truncate">
            {sectionTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/perfil"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#18324B] transition-colors hover:bg-[#F4F1E8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
        >
          <User className="h-4 w-4 text-[#315C78]" aria-hidden="true" />
          <span className="max-w-36 truncate">{firstName}</span>
        </Link>
      </div>
    </header>
  );
}
