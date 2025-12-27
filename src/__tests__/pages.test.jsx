import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CampaignBuilder from '../pages/CampaignBuilder';
import Analytics from '../pages/Analytics';

// Mock the data service
vi.mock('../lib/dataService', () => ({
  getDashboardStats: vi.fn(() => Promise.resolve({
    totalCampaigns: 10,
    totalLeads: 500,
    emailsSent: 1000,
    responseRate: 25
  })),
  getCampaigns: vi.fn(() => Promise.resolve([])),
  getLeads: vi.fn(() => Promise.resolve([])),
  getAnalytics: vi.fn(() => Promise.resolve({})),
}));

describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('displays stats cards', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Campaigns/i)).toBeInTheDocument();
      expect(screen.getByText(/Leads/i)).toBeInTheDocument();
    });
  });

  it('loads data on mount', async () => {
    const { getDashboardStats } = await import('../lib/dataService');
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(getDashboardStats).toHaveBeenCalled();
    });
  });
});

describe('CampaignBuilder Component', () => {
  it('renders campaign form', () => {
    render(
      <BrowserRouter>
        <CampaignBuilder />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Campaign Name/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <CampaignBuilder />
      </BrowserRouter>
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(
      <BrowserRouter>
        <CampaignBuilder />
      </BrowserRouter>
    );
    
    const nameInput = screen.getByLabelText(/Campaign Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    // Assert form submission
  });
});

describe('Analytics Component', () => {
  it('renders analytics charts', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
    });
  });

  it('displays date range selector', () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Date Range/i)).toBeInTheDocument();
  });
});
