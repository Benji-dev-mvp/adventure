import React from 'react';
import { Link } from 'react-router-dom';
import { AppRouter } from './router';

/**
 * MarketingApp component that uses the new marketing-focused structure
 * This can be used as the main app for the marketing site
 */
export function MarketingApp() {
  return <AppRouter />;
}

export default MarketingApp;
