import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number | string;
  hint: string;
  icon: LucideIcon;
  to?: string;
  actionLabel?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  to,
  actionLabel,
}: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#E2DDD0] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#315C78]">{label}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-[#18324B] tabular-nums">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F1E8] text-[#18324B]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EFEBE0] pt-3">
        <p className="text-xs text-[#315C78]">{hint}</p>
        {to && actionLabel && (
          <Link
            to={to}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#18324B] hover:text-[#315C78] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18324B]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
