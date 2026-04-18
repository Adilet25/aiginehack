interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="glow-text text-3xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm text-white/65 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  )
}