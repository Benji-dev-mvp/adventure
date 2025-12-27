const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enhanced performance tracking
export const trackPerformance = () => {
  // Track Web Vitals
  reportWebVitals((metric) => {
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}:`, metric.value, metric);
    }
  });

  // Track long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('[Performance] Long task detected:', entry.duration, 'ms');
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                value: Math.round(entry.duration),
                event_category: 'Performance',
              });
            }
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long task observer not supported');
    }
  }

  // Track navigation timing
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const metrics = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          dom: timing.domComplete - timing.domLoading,
          load: timing.loadEventEnd - timing.navigationStart,
        };
        
        console.log('[Performance] Navigation timing:', metrics);
      }, 0);
    });
  }
};

export default reportWebVitals;
