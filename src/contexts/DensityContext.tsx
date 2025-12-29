import React, { createContext, useContext, useEffect, useState } from 'react';

type DensityMode = 'comfortable' | 'compact';

interface DensityContextValue {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextValue | undefined>(undefined);

const STORAGE_KEY = 'artisan_density';

export const DensityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [density, setDensityState] = useState<DensityMode>(() => {
    if (typeof window === 'undefined') return 'comfortable';
    const saved = localStorage.getItem(STORAGE_KEY) as DensityMode | null;
    return saved === 'compact' ? 'compact' : 'comfortable';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, density);
    const root = document.documentElement;
    const body = document.body;
    root.setAttribute('data-density', density);
    body?.setAttribute('data-density', density);
  }, [density]);

  const setDensity = (mode: DensityMode) => setDensityState(mode);
  const toggleDensity = () =>
    setDensityState(prev => (prev === 'compact' ? 'comfortable' : 'compact'));

  return (
    <DensityContext.Provider value={{ density, setDensity, toggleDensity }}>
      {children}
    </DensityContext.Provider>
  );
};

export const useDensity = (): DensityContextValue => {
  const ctx = useContext(DensityContext);
  if (!ctx) {
    throw new Error('useDensity must be used within DensityProvider');
  }
  return ctx;
};
