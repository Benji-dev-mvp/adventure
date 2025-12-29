import React from 'react';
import PropTypes from 'prop-types';

/**
 * VueWidgetHost - DEPRECATED
 *
 * This component was designed to host Vue widgets within React.
 * The Vue integration has been deprecated in favor of a pure React architecture.
 *
 * If you need micro-frontend capabilities, consider:
 * - Module Federation (Webpack 5)
 * - Single-SPA
 * - Iframe-based isolation
 */
const VueWidgetHost = ({ title = 'Vue Widget' }) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-center">
      <div className="text-gray-500 dark:text-gray-400">
        <p className="font-medium">Vue Widget Deprecated</p>
        <p className="text-sm mt-1">
          The Vue integration has been removed. This placeholder shows where "{title}" would have
          appeared.
        </p>
      </div>
    </div>
  );
};

VueWidgetHost.propTypes = {
  title: PropTypes.string,
};

export default VueWidgetHost;
