import { useState } from "react";
import { useGame } from "../../app/providers/GameProvider";
import { useLang } from "../../app/providers/LanguageProvider";
import SubmissionViewer from "./SubmissionViewer";
import type { PetroSubmission, SubmissionStatus } from "../../types";

export default function MySubmissions() {
  const { submissions } = useGame();
  const { t } = useLang();
  const [selected, setSelected] = useState<PetroSubmission | null>(null);

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
    <>
      <div className="glow-card panel-ornament rounded-3xl p-5">
        <h3 className="text-lg font-bold text-ink ">
          {t.myUploads}
        </h3>

        {submissions.length === 0 ? (
          <p className="mt-3 text-sm text-ink  ">
            {t.noUploads}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => setSelected(submission)}
                className="overflow-hidden rounded-3xl border border-line  bg-wash  text-left transition hover:-translate-y-1 hover:border-line"
              >
                <img
                  src={submission.imageUrl}
                  alt={submission.title}
                  className="h-40 w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-ink ">
                      {submission.title}
                    </h4>
                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] uppercase ${
                        statusStyles[submission.status]
                      }`}
                    >
                      {statusLabel[submission.status]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink  ">
                    {submission.aiSummary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <SubmissionViewer
        submission={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
