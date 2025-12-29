import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import CampaignBuilder from '../pages/CampaignBuilder';
import Analytics from '../pages/Analytics';
import { TenantProvider } from '../contexts/TenantContext';

const mockShowToast = vi.fn();

vi.mock('../components/Toast', () => ({
  ToastProvider: ({ children }) => <div>{children}</div>,
  useToast: () => ({
    showToast: mockShowToast,
    success: mockShowToast,
    error: mockShowToast,
    info: mockShowToast,
    warning: mockShowToast,
  }),
}));

vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ width = 800, height = 400, children }) => (
      <div style={{ width, height }}>{children}</div>
    ),
  };
});

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

// Test wrapper with all required providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <TenantProvider>
      {children}
    </TenantProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('displays stats cards', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    
    expect(await screen.findByText(/Emails Sent/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Overview/i)).toBeInTheDocument();
  });
});

describe('CampaignBuilder Component', () => {
  beforeEach(() => {
    mockShowToast.mockClear();
  });

  it('renders campaign form', () => {
    render(
      <TestWrapper>
        <CampaignBuilder />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText(/Campaign Name/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <TestWrapper>
        <CampaignBuilder />
      </TestWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Campaign name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a target audience/i)).toBeInTheDocument();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Please fix the required fields', 'error');
  });

  it('submits form with valid data', async () => {
    render(
      <TestWrapper>
        <CampaignBuilder />
      </TestWrapper>
    );
    
    const nameInput = screen.getByLabelText(/Campaign Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
    const audienceSelect = screen.getByLabelText(/Target Audience/i);
    fireEvent.change(audienceSelect, { target: { value: 'enterprise' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Campaign submitted successfully', 'success');
    });
  });
});

describe('Analytics Component', () => {
  it('renders analytics charts', async () => {
    render(
      <TestWrapper>
        <Analytics />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
    });
  });

  it('displays date range selector', async () => {
    render(
      <TestWrapper>
        <Analytics />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Date Range/i)).toBeInTheDocument();
    });
  });
});
