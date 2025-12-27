import React from 'react';
import { Badge } from '../ui/Badge';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  pill?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function PageHeader({ 
  eyebrow, 
  title, 
  description, 
  pill,
  align = 'center',
  className = '' 
}: PageHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  
  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {pill && (
        <div className="mb-4">
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
            {pill}
          </Badge>
        </div>
      )}
      {eyebrow && (
        <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
