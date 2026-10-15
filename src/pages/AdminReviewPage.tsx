import PageHeader from "../components/shared/PageHeader";
import { useGame } from "../app/providers/GameProvider";
import { useLang } from "../app/providers/LanguageProvider";
import EmptyState from '../components/shared/EmptyState';
import { useInterfaceCopy } from '../data/interface';

export default function AdminReviewPage() {
  const { t } = useLang();
  const c = useInterfaceCopy();
  const { submissions, approveSubmission, rejectSubmission } = useGame();

  const pendingItems = submissions.filter((item) => item.status === "pending");

  return (
    <div className="muras-review">
      <PageHeader
        title={t.adminTitle}
        subtitle={t.adminSubtitle}
      />
      <p className="muras-result-count" role="status">{c.pending}: {pendingItems.length}</p>

      {pendingItems.length === 0 ? (
        <EmptyState title={c.complete} description={t.noPending} />
      ) : (
        <div className="muras-review-list">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="muras-review-item"
            >
              <div className="overflow-hidden rounded-2xl border border-line">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                />
              </div>

              <div><h3 className="mt-4 text-xl font-bold text-ink ">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink ">
                {item.aiSummary}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => approveSubmission(item.id)}
                  className="rounded-2xl border border-sage bg-sage-soft px-4 py-3 text-sm font-semibold text-ink  transition hover:bg-sage-soft"
                >
                  {t.approve}
                </button>

                <button
                  onClick={() => rejectSubmission(item.id)}
                  className="rounded-2xl border border-danger bg-danger-soft px-4 py-3 text-sm font-semibold text-danger transition hover:bg-danger-soft"
                >
                  {t.reject}
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
