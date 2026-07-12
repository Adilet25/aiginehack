import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
};

export default function GlowButton({ className, children, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-600 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition-all duration-200",
        "hover:bg-amber-700 hover:shadow-md active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}
