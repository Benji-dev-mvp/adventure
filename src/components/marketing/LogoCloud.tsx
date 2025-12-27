import React from 'react';

type Logo = {
  name: string;
  src?: string;
  className?: string;
};

type LogoCloudProps = {
  logos?: Logo[];
  title?: string;
};

export function LogoCloud({ logos, title = "Trusted by leading companies" }: LogoCloudProps) {
  const defaultLogos: Logo[] = logos || [
    { name: 'Company 1', className: 'h-8' },
    { name: 'Company 2', className: 'h-8' },
    { name: 'Company 3', className: 'h-8' },
    { name: 'Company 4', className: 'h-8' },
    { name: 'Company 5', className: 'h-8' },
    { name: 'Company 6', className: 'h-8' },
  ];

  return (
    <section className="bg-slate-900/60 border-b border-slate-800 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-medium text-slate-400 mb-8">
          {title}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {defaultLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={logo.className || 'h-8 w-auto'}
                />
              ) : (
                <div className="h-8 w-24 bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-xs text-slate-400">{logo.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
