/** Graphic interpretation of the user's supplied mark, not a historical attribution. */
export default function BrandMark({ className = '' }: { className?: string }) {
  return <svg className={`muras-mark ${className}`} width="42" height="48" viewBox="0 0 42 48" fill="none" aria-hidden="true" focusable="false">
    <path d="M8 7 25 24 8 41M22 7 39 24 22 41M6 20 18 8" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>;
}
