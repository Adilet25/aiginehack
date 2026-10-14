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
        "heritage-button",
        className,
      )}
    >
      {children}
    </button>
  );
}
