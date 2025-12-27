import React from 'react';

const variantClasses = {
  default: "bg-slate-950",
  muted: "bg-slate-900/60",
  surface: "bg-slate-900",
};

export function PageSection({ id, variant = "default", children, className = "" }) {
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
