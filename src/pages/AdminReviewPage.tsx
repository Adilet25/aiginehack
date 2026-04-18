import PageHeader from '../components/shared/PageHeader'
import { useGame } from '../app/providers/GameProvider'

export default function AdminReviewPage() {
  const { submissions, approveSubmission, rejectSubmission } = useGame()

  const pendingItems = submissions.filter((item) => item.status === 'pending')

  return (
    <div>
      <PageHeader
        title="Admin Review"
        subtitle="Проверка пользовательских находок перед публикацией на карте."
      />

      {pendingItems.length === 0 ? (
        <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-white/60">Нет pending заявок.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="glow-card rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/65">{item.aiSummary}</p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => approveSubmission(item.id)}
                  className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectSubmission(item.id)}
                  className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}