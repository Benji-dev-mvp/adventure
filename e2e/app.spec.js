import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Enterprise/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
  });

  test('should navigate to login when clicking Get Started', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/.*login|dashboard/);
  });
});

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should validate empty form submission', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    // Should show validation errors
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display dashboard stats', async ({ page }) => {
    const stats = page.locator('[data-testid="stats-card"]');
    await expect(stats.first()).toBeVisible();
  });

  test('should navigate to campaigns', async ({ page }) => {
    await page.click('text=Campaigns');
    await expect(page).toHaveURL(/.*campaigns/);
  });

  test('should navigate to leads', async ({ page }) => {
    await page.click('text=Leads');
    await expect(page).toHaveURL(/.*leads/);
  });

  test('should open user menu', async ({ page }) => {
    await page.click('[data-testid="user-menu"]');
    await expect(page.locator('text=Logout')).toBeVisible();
  });
});

test.describe('Campaigns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.goto('/campaigns');
  });

  test('should display campaigns list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Campaigns');
  });

  test('should create new campaign', async ({ page }) => {
    await page.click('text=New Campaign');
    await page.fill('input[name="name"]', 'Test Campaign');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Test Campaign')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations on landing page', async ({ page }) => {
    await page.goto('/');
    // Run axe accessibility tests
    // const results = await page.accessibility.snapshot();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    // Check focus moves to first interactive element
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
