import type { ReactNode } from 'react';
import BrandMark from './BrandMark';

export default function EmptyState({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <div className="muras-empty"><BrandMark /><h2>{title}</h2>{description && <p>{description}</p>}{children && <div className="muras-empty-actions">{children}</div>}</div>;
}
