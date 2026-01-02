import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter - Reusable animated number counter
 * Eliminates duplication of counter logic across Dashboard and analytics pages
 */
export const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = progress * (2 - progress);
      const currentCount = easeOutQuad * end;

      setCount(currentCount);
      countRef.current = currentCount;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  const formattedValue =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
