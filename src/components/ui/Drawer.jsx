import React, { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const DrawerContext = createContext();

const Drawer = ({ 
  open, 
  onClose, 
  children, 
  position = 'right',
  className,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const positions = {
    left: 'inset-y-0 left-0',
    right: 'inset-y-0 right-0',
    top: 'inset-x-0 top-0',
    bottom: 'inset-x-0 bottom-0',
  };

  const transforms = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  if (!isOpen && !open) return null;

  return (
    <DrawerContext.Provider value={{ onClose: handleClose }}>
      <div className="fixed inset-0 z-50 overflow-hidden" {...props}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          className={cn(
            "fixed bg-white dark:bg-gray-900 shadow-xl",
            "transition-transform duration-300 ease-in-out",
            positions[position],
            transforms[position],
            (position === 'left' || position === 'right') && "w-full max-w-md",
            (position === 'top' || position === 'bottom') && "h-auto max-h-[80vh]",
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </DrawerContext.Provider>
  );
};

const DrawerHeader = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DrawerTitle = ({ children, className, ...props }) => {
  return (
    <h2 
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

const DrawerClose = ({ children, className, ...props }) => {
  const { onClose } = useContext(DrawerContext);

  return (
    <button
      onClick={onClose}
      className={cn(
        "rounded-md p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        className
      )}
      aria-label="Close"
      {...props}
    >
      {children || (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
};

const DrawerContent = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "p-6 overflow-y-auto flex-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DrawerFooter = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Drawer.displayName = 'Drawer';
DrawerHeader.displayName = 'DrawerHeader';
DrawerTitle.displayName = 'DrawerTitle';
DrawerClose.displayName = 'DrawerClose';
DrawerContent.displayName = 'DrawerContent';
DrawerFooter.displayName = 'DrawerFooter';

export { Drawer, DrawerHeader, DrawerTitle, DrawerClose, DrawerContent, DrawerFooter };
export default Drawer;
