import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export function FeedbackBanner() {
  const { feedback, dismissFeedback } = useLibrary();

  if (!feedback) {
    return null;
  }

  const styles =
    feedback.type === 'success'
      ? 'bg-[#18324B] text-[#FFFFFF] border-[#D5A85B]'
      : feedback.type === 'error'
        ? 'bg-[#991B1B] text-[#FFFFFF] border-[#FCA5A5]/40'
        : 'bg-[#315C78] text-[#FFFFFF] border-[#D5A85B]/60';

  const Icon =
    feedback.type === 'success'
      ? CheckCircle2
      : feedback.type === 'error'
        ? AlertCircle
        : Info;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100%-2.5rem)]">
      <div
        role={feedback.type === 'error' ? 'alert' : 'status'}
        className={`flex items-start gap-3 rounded-lg border px-4 py-3.5 shadow-lg transition-all duration-200 ${styles}`}
      >
        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-[#D5A85B]" aria-hidden="true" />
        <p className="flex-1 text-sm leading-snug">{feedback.text}</p>
        <button
          type="button"
          onClick={dismissFeedback}
          aria-label="Cerrar notificación"
          className="shrink-0 rounded p-1 text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5A85B]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
