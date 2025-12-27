import React from 'react';

type Stat = {
  label: string;
  value: string;
};

type StatBandProps = {
  stats: Stat[];
};

export function StatBand({ stats }: StatBandProps) {
  return (
    <section className="bg-slate-950 border-b border-slate-800 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-slate-50 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
