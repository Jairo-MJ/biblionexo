import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#E2DDD0] bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F4F1E8] text-[#315C78]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold text-[#18324B]">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#315C78]">
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#18324B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] whitespace-nowrap shrink-0"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#18324B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#315C78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B] whitespace-nowrap shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
