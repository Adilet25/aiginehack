import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function GlowButton({
  children,
  className,
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-3 font-semibold text-white transition-all duration-300',
        'shadow-[0_0_20px_rgba(255,210,48,0.25)] hover:scale-[1.02] hover:border-amber-300 hover:bg-amber-500/20 hover:shadow-[0_0_30px_rgba(255,210,48,0.25)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}