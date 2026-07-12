import type { PetroSubmission } from "../../types";

interface SubmissionViewerProps {
  submission: PetroSubmission | null;
  onClose: () => void;
}

export default function SubmissionViewer({
  submission,
  onClose,
}: SubmissionViewerProps) {
  if (!submission) return null;

  const statusStyles = {
    pending:
      "border-amber-400/25 bg-amber-500/10 text-stone-900 dark:text-white",
    approved:
      "border-emerald-400/25 bg-emerald-500/10 text-stone-900 dark:text-white",
    rejected: "border-red-400/25 bg-red-500/10 text-red-100",
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glow-card w-full max-w-5xl animate-[fadeIn_.25s_ease] rounded-3xl border border-white/10 p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <img
              src={submission.imageUrl}
              alt={submission.title}
              className="h-[280px] w-full object-cover transition duration-500 md:h-[560px]"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  {submission.title}
                </h2>
                <p className="mt-1 text-sm text-stone-900 dark:text-white/50">
                  Uploaded: {new Date(submission.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                  statusStyles[submission.status]
                }`}
              >
                {submission.status}
              </span>
            </div>

            <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
              <p className="text-xs uppercase tracking-wide text-blue-100/60">
                AI mock analysis
              </p>
              <h3 className="mt-2 text-lg font-bold text-blue-50">
                Possible interpretation
              </h3>
              <p className="mt-3 text-sm leading-7 text-blue-50/90">
                {submission.aiSummary}
              </p>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wide text-stone-900 dark:text-white/40">
                Suggested type
              </p>
              <p className="mt-2 text-base font-semibold text-stone-900 dark:text-white">
                {submission.suggestedType}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-stone-900 dark:text-white transition hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
