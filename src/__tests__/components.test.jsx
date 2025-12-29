import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../components/features/StatsCard';
import CampaignCard from '../components/features/CampaignCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';

describe('StatsCard Component', () => {
  it('renders with title and value', () => {
    render(<StatsCard title="Total Campaigns" value={10} />);
    expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays icon when provided', () => {
    const Icon = () => <svg data-testid="test-icon" />;
    render(<StatsCard title="Test" value={5} icon={Icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('shows trend indicator', () => {
    render(<StatsCard title="Test" value={10} trend={15} />);
    expect(screen.getByText(/15%/)).toBeInTheDocument();
  });
});

describe('CampaignCard Component', () => {
  const mockCampaign = {
    id: 1,
    name: 'Test Campaign',
    status: 'active',
    leads: 100,
    sent: 50,
  };

  it('renders campaign information', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('displays campaign metrics', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });
});

describe('AnimatedButton Component', () => {
  it('renders button with text', () => {
    render(<AnimatedButton>Click Me</AnimatedButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton onClick={handleClick}>Click</AnimatedButton>);

    const button = screen.getByRole('button', { name: /click/i });
    button.click();

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<AnimatedButton disabled>Disabled</AnimatedButton>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });
});
