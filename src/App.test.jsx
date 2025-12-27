import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading state while routes load', async () => {
  render(<App />);
  expect(await screen.findByText(/Loading Artisan/i)).toBeInTheDocument();
});
