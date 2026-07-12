import type { ReactNode } from "react";

type Props = { label: string; value: string | number | ReactNode };

export default function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-900">{value}</p>
    </div>
  );
}
