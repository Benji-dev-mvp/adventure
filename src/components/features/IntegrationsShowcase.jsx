import React from 'react';
import PropTypes from 'prop-types';

const integrations = [
  { name: 'HubSpot', short: 'HS', gradient: 'from-orange-400 to-red-400' },
  { name: 'Salesforce', short: 'SF', gradient: 'from-sky-500 to-blue-600' },
  { name: 'Slack', short: 'SL', gradient: 'from-teal-400 to-cyan-500' },
  { name: 'ClickUp', short: 'CU', gradient: 'from-purple-400 to-pink-400' },
  { name: 'Google', short: 'G', gradient: 'from-amber-400 to-red-500' },
  { name: 'Outlook', short: 'OL', gradient: 'from-blue-500 to-indigo-600' },
];

const replacements = [
  { name: 'Apollo', short: 'Ap', gradient: 'from-indigo-500 to-slate-800' },
  { name: 'ZoomInfo', short: 'Zi', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Gong', short: 'Go', gradient: 'from-amber-400 to-orange-500' },
  { name: 'Zapier', short: 'Za', gradient: 'from-orange-500 to-red-500' },
  { name: 'Salesloft', short: 'Sl', gradient: 'from-blue-500 to-sky-400' },
  { name: 'Outreach', short: 'Ou', gradient: 'from-fuchsia-500 to-pink-600' },
  { name: 'Calendly', short: 'Ca', gradient: 'from-cyan-500 to-blue-500' },
  { name: 'Airtable', short: 'Ai', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Intercom', short: 'In', gradient: 'from-sky-500 to-indigo-500' },
  { name: 'HubSpot Sales', short: 'Hs', gradient: 'from-orange-400 to-red-400' },
  { name: 'Clari', short: 'Cl', gradient: 'from-emerald-500 to-green-600' },
  { name: 'Lemlist', short: 'Le', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Clearbit', short: 'Cb', gradient: 'from-blue-500 to-slate-700' },
  { name: 'Vitally', short: 'Vi', gradient: 'from-purple-400 to-violet-600' },
  { name: 'Drift', short: 'Dr', gradient: 'from-blue-400 to-indigo-500' },
  { name: 'Zendesk', short: 'Zd', gradient: 'from-emerald-400 to-teal-600' },
];

const Tile = ({ item }) => (
  <div className="group relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-sm font-bold text-white shadow-lg`}
    >
      {item.short}
    </div>
    <span className="sr-only">{item.name}</span>
  </div>
);

Tile.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    short: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
  }).isRequired,
};

const IntegrationsShowcase = () => {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0b072d] text-white shadow-2xl">
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-artisan-purple blur-3xl opacity-40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-artisan-magenta blur-3xl opacity-30"
            aria-hidden
          />

          <div className="relative grid gap-12 p-10 md:p-14 lg:grid-cols-[1fr_auto_1fr] items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Integrations
                </p>
                <h3 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                  Plays Well With Others
                </h3>
                <p className="mt-3 max-w-md text-lg text-white/70">
                  Easily integrates with the tools you already use.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {integrations.map(item => (
                  <Tile key={item.name} item={item} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-white/10 to-white/5 shadow-2xl backdrop-blur">
                <div className="h-16 w-16 rounded-2xl bg-gradient-magenta shadow-xl" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-left lg:text-right">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Consolidation
                </p>
                <h3 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                  Replaces Them Entirely
                </h3>
                <p className="mt-3 text-lg text-white/70 lg:ml-auto lg:max-w-md">
                  Consolidate dozens of tools with one Artisan subscription.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {replacements.map(item => (
                  <Tile key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsShowcase;
