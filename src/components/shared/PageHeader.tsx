type Props = { title: string; subtitle?: string };

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-black text-stone-900 dark:text-white md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-stone-500 dark:text-white/50">{subtitle}</p>
      )}
    </div>
  );
}
