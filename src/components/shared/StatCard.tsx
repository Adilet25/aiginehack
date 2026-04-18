import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
      {hint && <p className="mt-2 text-xs text-white/45">{hint}</p>}
    </div>
  )
}