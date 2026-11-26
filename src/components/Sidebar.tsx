import {
  BookMarked,
  BookOpen,
  Heart,
  Home,
  Library,
  User,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { favorites, loans } = useLibrary();

  const activeLoansCount = loans.filter((l) => l.status === 'Activo').length;

  const navItems = [
    { to: '/', label: 'Inicio', icon: Home, end: true },
    { to: '/catalogo', label: 'Catálogo', icon: Library, end: false },
    {
      to: '/favoritos',
      label: 'Mis favoritos',
      icon: Heart,
      count: favorites.length,
      end: false,
    },
    {
      to: '/prestamos',
      label: 'Mis préstamos',
      icon: BookMarked,
      count: activeLoansCount,
      end: false,
    },
    { to: '/perfil', label: 'Mi perfil', icon: User, end: false },
  ];

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#18324B] text-[#F4F1E8]">
      <div>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5A85B]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D5A85B] text-[#18324B]">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-white whitespace-nowrap">
              BiblioNexo
            </span>
          </NavLink>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú de navegación"
            className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5A85B]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1.5" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex min-h-11 items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5A85B] ${
                    isActive
                      ? 'bg-[#315C78] text-white'
                      : 'text-[#F4F1E8]/80 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[#D5A85B]" aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span className="font-mono text-xs text-[#D5A85B] tabular-nums">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-xs text-[#F4F1E8]/70 space-y-1">
        <p className="font-medium text-white/90">Biblioteca Digital</p>
        <p>Universidad de Guadalajara · CUCEI</p>
        <p className="font-mono text-[11px] text-[#D5A85B]">Calendario 2026B</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra lateral fija en escritorio */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-[#112437]">
        {navContent}
      </aside>

      {/* Menú lateral adaptable para dispositivos móviles */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="fixed inset-0 bg-[#112437]/60 backdrop-blur-[2px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 w-72 max-w-[85vw] h-full shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
