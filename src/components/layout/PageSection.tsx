import React from 'react';

type PageSectionProps = {
  id?: string;
  variant?: "default" | "muted" | "surface";
  children: React.ReactNode;
  className?: string;
};

const variantClasses: Record<NonNullable<PageSectionProps["variant"]>, string> = {
  default: "bg-slate-950",
  muted: "bg-slate-900/60",
  surface: "bg-slate-900",
};

export function PageSection({ id, variant = "default", children, className = "" }: PageSectionProps) {
  return (
    <section
      id={id}
      className={`${variantClasses[variant]} border-b border-slate-800 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        {children}
      </div>
    </section>
  );
}
