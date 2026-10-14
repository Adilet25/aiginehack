import type { PetroSubmission, SubmissionStatus } from "../../types";
import { useLang } from "../../app/providers/LanguageProvider";

interface SubmissionViewerProps {
  submission: PetroSubmission | null;
  onClose: () => void;
}

export default function SubmissionViewer({
  submission,
  onClose,
}: SubmissionViewerProps) {
  const { t } = useLang();

  if (!submission) return null;

  const statusStyles: Record<SubmissionStatus, string> = {
    pending:
      "border-gold bg-gold-soft text-ink ",
    approved:
      "border-sage bg-sage-soft text-ink ",
    rejected: "border-danger bg-danger-soft text-danger",
  };

  const statusLabel: Record<SubmissionStatus, string> = {
    pending: t.statusPending,
    approved: t.statusApproved,
    rejected: t.statusRejected,
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glow-card w-full max-w-5xl animate-[fadeIn_.25s_ease] rounded-3xl border border-line  p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-line  bg-wash ">
            <img
              src={submission.imageUrl}
              alt={submission.title}
              className="h-[280px] w-full object-cover transition duration-500 md:h-[560px]"
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-ink ">
                  {submission.title}
                </h2>
                <p className="mt-1 text-sm text-ink  ">
                  {t.uploaded}: {new Date(submission.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                  statusStyles[submission.status]
                }`}
              >
                {statusLabel[submission.status]}
              </span>
            </div>

            <div className="rounded-3xl border border-sky bg-sky-soft p-5">
              <p className="text-xs uppercase tracking-wide text-sky">
                {t.aiMockAnalysis}
              </p>
              <h3 className="mt-2 text-lg font-bold text-sky">
                {t.possibleInterpretation}
              </h3>
              <p className="mt-3 text-sm leading-7 text-sky">
                {submission.aiSummary}
              </p>
            </div>

            <div className="mt-4 rounded-3xl border border-line  bg-wash  p-5">
              <p className="text-xs uppercase tracking-wide text-ink  ">
                {t.suggestedType}
              </p>
              <p className="mt-2 text-base font-semibold text-ink ">
                {submission.suggestedType}
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-auto rounded-2xl border border-line  bg-surface  px-4 py-3 text-sm font-semibold text-ink   transition hover:bg-surface"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
