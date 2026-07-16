import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-300 border border-gold-500",
  secondary:
    "bg-transparent text-navy-950 border border-navy-950 hover:bg-navy-950 hover:text-cream-50",
  ghost:
    "bg-transparent text-cream-50 border border-cream-50/40 hover:border-gold-500 hover:text-gold-300",
};

export default function Button({
  href,
  children,
  variant = "primary",
  icon,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </Link>
  );
}
