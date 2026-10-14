import type { ReactNode } from "react";

type Props = { label: string; value: string | number | ReactNode };

export default function StatCard({ label, value }: Props) {
  return (
    <div className="heritage-stat">
      <p className="heritage-stat-label">
        {label}
      </p>
      <p className="heritage-stat-value">
        {value}
      </p>
    </div>
  );
}
