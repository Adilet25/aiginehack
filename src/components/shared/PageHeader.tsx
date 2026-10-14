type Props = { title: string; subtitle?: string };

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="heritage-page-header">
      <div className="heritage-kicker">Мурас / {title}</div>
      <h1>
        {title}
      </h1>
      {subtitle && (
        <p>{subtitle}</p>
      )}
    </div>
  );
}
