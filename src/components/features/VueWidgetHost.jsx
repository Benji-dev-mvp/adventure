import React, { useEffect, useRef, useState } from 'react';

const VueWidgetHost = ({ title = 'Vue Widget', initial = 0 }) => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let controller;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import('../../vue/mountVueWidget.js');
        if (cancelled) return;
        controller = mod.mount(containerRef.current, { title, initial });
        setMounted(true);
      } catch (e) {
        console.error('Failed to load Vue widget', e);
        setError('Failed to load widget');
      }
    })();

    return () => {
      cancelled = true;
      if (controller) controller.unmount();
    };
  }, [title, initial]);

  return (
    <div>
      <div ref={containerRef} />
      {!mounted && !error && (
        <div className="text-xs text-gray-500">Loading Vue widget…</div>
      )}
      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
    </div>
  );
};

export default VueWidgetHost;
