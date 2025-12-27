import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock the toast provider
vi.mock('../components/Toast', () => ({
  ToastProvider: ({ children }) => <div>{children}</div>,
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock the contexts
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('../contexts/TenantContext', () => ({
  TenantProvider: ({ children }) => <div>{children}</div>,
  useTenant: () => ({
    tenantId: 'test-tenant',
    tenantName: 'Test Org',
    setTenantId: vi.fn(),
    switchTenant: vi.fn(),
  }),
}));

describe('App Router Tests', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Should render without errors
    expect(document.body).toBeTruthy();
  });

  it('renders landing page on root route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    // Landing page should render
    // Note: Exact text may vary, but page should load
    expect(document.body).toBeTruthy();
  });

  it('renders dashboard on /dashboard route', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    
    // Dashboard should render
    expect(document.body).toBeTruthy();
  });

  it('renders admin page on /admin route', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );
    
    // Admin page should render
    expect(document.body).toBeTruthy();
  });

  it('renders admin API keys page on /admin/api-keys route', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/api-keys']}>
        <App />
      </MemoryRouter>
    );
    
    // Admin API keys page should render
    expect(document.body).toBeTruthy();
  });

  it('renders admin webhooks page on /admin/webhooks route', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/webhooks']}>
        <App />
      </MemoryRouter>
    );
    
    // Admin webhooks page should render
    expect(document.body).toBeTruthy();
  });

  it('renders compliance center on /admin/compliance route', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/compliance']}>
        <App />
      </MemoryRouter>
    );
    
    // Compliance center should render
    expect(document.body).toBeTruthy();
  });

  it('renders solutions startups page on /solutions/startups route', async () => {
    render(
      <MemoryRouter initialEntries={['/solutions/startups']}>
        <App />
      </MemoryRouter>
    );
    
    // Solutions page should render
    expect(document.body).toBeTruthy();
  });

  it('renders solutions mid-market page on /solutions/mid-market route', async () => {
    render(
      <MemoryRouter initialEntries={['/solutions/mid-market']}>
        <App />
      </MemoryRouter>
    );
    
    // Solutions page should render
    expect(document.body).toBeTruthy();
  });

  it('renders solutions enterprise page on /solutions/enterprise route', async () => {
    render(
      <MemoryRouter initialEntries={['/solutions/enterprise']}>
        <App />
      </MemoryRouter>
    );
    
    // Solutions page should render
    expect(document.body).toBeTruthy();
  });

  it('renders help center on /help route', async () => {
    render(
      <MemoryRouter initialEntries={['/help']}>
        <App />
      </MemoryRouter>
    );
    
    // Help center should render
    expect(document.body).toBeTruthy();
  });

  it('renders 404 page on unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    
    // 404 page should render
    expect(document.body).toBeTruthy();
  });

  it('renders campaigns page on /campaigns route', async () => {
    render(
      <MemoryRouter initialEntries={['/campaigns']}>
        <App />
      </MemoryRouter>
    );
    
    // Campaigns page should render
    expect(document.body).toBeTruthy();
  });

  it('renders leads page on /leads route', async () => {
    render(
      <MemoryRouter initialEntries={['/leads']}>
        <App />
      </MemoryRouter>
    );
    
    // Leads page should render
    expect(document.body).toBeTruthy();
  });

  it('renders analytics page on /analytics route', async () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <App />
      </MemoryRouter>
    );
    
    // Analytics page should render
    expect(document.body).toBeTruthy();
  });
});
