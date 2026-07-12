import { useState } from "react";
import { useGame } from "../../app/providers/GameProvider";
import SubmissionViewer from "./SubmissionViewer";
import type { PetroSubmission } from "../../types";

export default function MySubmissions() {
  const { submissions } = useGame();
  const [selected, setSelected] = useState<PetroSubmission | null>(null);

  const statusStyles = {
    pending: "border-amber-400/20 bg-amber-500/10 text-stone-900",
    approved: "border-emerald-400/20 bg-emerald-500/10 text-stone-900",
    rejected: "border-red-400/20 bg-red-500/10 text-red-100",
  };

  return (
    <>
      <div className="glow-card panel-ornament rounded-3xl p-5">
        <h3 className="text-lg font-bold text-stone-900">My Uploads</h3>

        {submissions.length === 0 ? (
          <p className="mt-3 text-sm text-stone-900/55">Пока загрузок нет.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {submissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => setSelected(submission)}
                className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 text-left transition hover:-translate-y-1 hover:border-white/20"
              >
                <img
                  src={submission.imageUrl}
                  alt={submission.title}
                  className="h-40 w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-stone-900">
                      {submission.title}
                    </h4>
                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] uppercase ${
                        statusStyles[submission.status]
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-stone-900/60">
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
