import { useState } from 'react';
import type { Book, JacketMotif } from '../types/library';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function MotifArtwork({ motif, accent }: { motif: JacketMotif; accent: string }) {
  switch (motif) {
    case 'orbit':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <circle cx="60" cy="60" r="42" fill="none" stroke={accent} strokeWidth="1.4" />
          <ellipse
            cx="60"
            cy="60"
            rx="48"
            ry="18"
            transform="rotate(-24 60 60)"
            fill="none"
            stroke="#F4F1E8"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle cx="60" cy="60" r="8" fill={accent} />
          <circle cx="94" cy="40" r="3.5" fill="#F4F1E8" />
        </svg>
      );
    case 'arch':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <path
            d="M28 102 V56 A32 32 0 0 1 92 56 V102"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
          <path
            d="M40 102 V58 A20 20 0 0 1 80 58 V102"
            fill="none"
            stroke="#F4F1E8"
            strokeWidth="1.1"
            opacity="0.75"
          />
          <line x1="20" y1="102" x2="100" y2="102" stroke={accent} strokeWidth="1.2" />
          <circle cx="60" cy="54" r="4" fill={accent} />
        </svg>
      );
    case 'botanical':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <path d="M60 102 V24" stroke={accent} strokeWidth="1.5" />
          <path
            d="M60 78 C38 74 30 56 36 42 C50 46 58 60 60 78 Z"
            fill="none"
            stroke="#F4F1E8"
            strokeWidth="1.2"
          />
          <path
            d="M60 64 C82 60 90 42 84 28 C70 32 62 46 60 64 Z"
            fill="none"
            stroke={accent}
            strokeWidth="1.4"
          />
          <circle cx="60" cy="22" r="4" fill={accent} />
        </svg>
      );
    case 'compass':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <circle cx="60" cy="60" r="38" fill="none" stroke={accent} strokeWidth="1.4" />
          <polygon points="60,18 67,53 102,60 67,67 60,102 53,67 18,60 53,53" fill="none" stroke="#F4F1E8" strokeWidth="1.2" />
          <circle cx="60" cy="60" r="5" fill={accent} />
        </svg>
      );
    case 'lattice':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <rect x="26" y="26" width="68" height="68" fill="none" stroke={accent} strokeWidth="1.4" />
          <rect
            x="38"
            y="38"
            width="44"
            height="44"
            transform="rotate(45 60 60)"
            fill="none"
            stroke="#F4F1E8"
            strokeWidth="1.2"
          />
          <line x1="26" y1="60" x2="94" y2="60" stroke={accent} strokeWidth="1" opacity="0.65" />
          <line x1="60" y1="26" x2="60" y2="94" stroke={accent} strokeWidth="1" opacity="0.65" />
        </svg>
      );
    case 'quill':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" aria-hidden="true">
          <path
            d="M32 94 C44 64 62 38 92 22 C84 52 68 74 44 86 L32 94 Z"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
          <line x1="28" y1="98" x2="86" y2="28" stroke="#F4F1E8" strokeWidth="1.1" opacity="0.8" />
          <line x1="26" y1="98" x2="94" y2="98" stroke={accent} strokeWidth="1.2" />
        </svg>
      );
  }
}

export function BookCover({ book, size = 'md', className = '' }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(book.coverUrl) && !imageError;

  const paddingBySize =
    size === 'sm' ? 'p-3' : size === 'lg' ? 'p-6 sm:p-8' : 'p-4';
  const titleClassBySize =
    size === 'sm'
      ? 'text-xs leading-snug'
      : size === 'lg'
        ? 'text-xl sm:text-2xl leading-tight'
        : 'text-base leading-snug';
  const authorClassBySize =
    size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#DCD6C8] bg-[#18324B] select-none ${className}`}
    >
      {showImage ? (
        <img
          src={book.coverUrl}
          alt={`Portada de ${book.title} por ${book.author}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className={`relative flex h-full w-full flex-col justify-between ${paddingBySize} text-[#F4F1E8]`}
          style={{ backgroundColor: book.coverEdition.bg }}
        >
          {/* Lomo lateral de encuadernación */}
          <div
            className="absolute inset-y-0 left-0 w-3 border-r border-white/10"
            style={{ backgroundColor: book.coverEdition.spine }}
            aria-hidden="true"
          />

          {/* Marco editorial interior */}
          <div
            className="pointer-events-none absolute inset-2.5 left-4 rounded-sm border opacity-35"
            style={{ borderColor: book.coverEdition.accent }}
            aria-hidden="true"
          />

          {size !== 'sm' && (
            <div className="relative z-10 pl-2 pr-10 flex items-center gap-2">
              <span
                className="font-mono text-[10px] tracking-wider uppercase truncate"
                style={{ color: book.coverEdition.accent }}
              >
                {book.catalogCode}
              </span>
            </div>
          )}

          <div className="relative z-10 pl-2 flex flex-1 items-center justify-center">
            <MotifArtwork
              motif={book.coverEdition.motif}
              accent={book.coverEdition.accent}
            />
          </div>

          {size !== 'sm' && (
            <div className="relative z-10 pl-2 space-y-1 border-t border-[#F4F1E8]/15 pt-2.5">
              <p className={`font-serif font-semibold text-[#FFFFFF] line-clamp-2 ${titleClassBySize}`}>
                {book.title}
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[#F4F1E8]/80 truncate ${authorClassBySize}`}>
                  {book.author}
                </p>
                <span className="font-mono text-[10px] text-[#F4F1E8]/70 tabular-nums shrink-0">
                  {book.year}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
