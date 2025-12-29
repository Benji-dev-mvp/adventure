import React from 'react';
import { cn } from '../../lib/utils';

export const Avatar = ({ children, className }) => {
  return (
    <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
    />
  );
};

export const AvatarFallback = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-primary-500 text-white font-semibold text-sm',
        className
      )}
    >
      {children}
    </div>
  );
};
