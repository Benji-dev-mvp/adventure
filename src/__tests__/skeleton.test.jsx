import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonGroup,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonDashboard,
} from '../components/ui/Skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render with default variant', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('bg-gray-200');
    });

    it('should render with text variant', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('h-4');
      expect(skeleton).toHaveClass('w-3/4');
    });

    it('should render with title variant', () => {
      const { container } = render(<Skeleton variant="title" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('h-8');
      expect(skeleton).toHaveClass('w-1/2');
    });

    it('should render with avatar variant', () => {
      const { container } = render(<Skeleton variant="avatar" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('h-12');
      expect(skeleton).toHaveClass('w-12');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('custom-class');
    });
  });

  describe('SkeletonGroup', () => {
    it('should render single skeleton when count is 1', () => {
      const { container } = render(
        <SkeletonGroup count={1}>
          <Skeleton />
        </SkeletonGroup>
      );
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render multiple skeletons when count > 1', () => {
      const { container } = render(<SkeletonGroup count={3} />);
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <SkeletonGroup count={2} className="custom-group" />
      );
      expect(container.firstChild).toHaveClass('custom-group');
      expect(container.firstChild).toHaveClass('space-y-2');
    });
  });

  describe('SkeletonCard', () => {
    it('should render card skeleton with title and text', () => {
      const { container } = render(<SkeletonCard />);
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply custom className', () => {
      const { container } = render(<SkeletonCard className="custom-card" />);
      expect(container.firstChild).toHaveClass('custom-card');
      expect(container.firstChild).toHaveClass('p-4');
      expect(container.firstChild).toHaveClass('border');
    });
  });

  describe('SkeletonTable', () => {
    it('should render table skeleton with default rows and columns', () => {
      const { container } = render(<SkeletonTable />);
      // Default is 5 rows + 1 header row = 6 total
      const rows = container.querySelectorAll('.flex.gap-4');
      expect(rows.length).toBeGreaterThanOrEqual(5);
    });

    it('should render table skeleton with custom rows and columns', () => {
      const { container } = render(<SkeletonTable rows={3} columns={3} />);
      const rows = container.querySelectorAll('.flex.gap-4');
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply custom className', () => {
      const { container } = render(<SkeletonTable className="custom-table" />);
      expect(container.firstChild).toHaveClass('custom-table');
      expect(container.firstChild).toHaveClass('space-y-3');
    });
  });

  describe('SkeletonList', () => {
    it('should render list skeleton with default items', () => {
      const { container } = render(<SkeletonList />);
      // Default is 5 items
      const items = container.querySelectorAll('.flex.items-center.gap-4');
      expect(items).toHaveLength(5);
    });

    it('should render list skeleton with custom item count', () => {
      const { container } = render(<SkeletonList items={3} />);
      const items = container.querySelectorAll('.flex.items-center.gap-4');
      expect(items).toHaveLength(3);
    });

    it('should include avatar and text skeletons', () => {
      const { container } = render(<SkeletonList items={1} />);
      const avatars = container.querySelectorAll('.rounded-full');
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonDashboard', () => {
    it('should render complete dashboard skeleton', () => {
      const { container } = render(<SkeletonDashboard />);
      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThan(10);
    });

    it('should include stats cards grid', () => {
      const { container } = render(<SkeletonDashboard />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { container } = render(<SkeletonDashboard className="custom-dashboard" />);
      expect(container.firstChild).toHaveClass('custom-dashboard');
      expect(container.firstChild).toHaveClass('space-y-6');
    });
  });

  describe('Dark mode support', () => {
    it('should have dark mode classes', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild;
      expect(skeleton.className).toContain('dark:bg-gray-700');
    });
  });

  describe('Accessibility', () => {
    it('should render as div elements', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    it('should not have any interactive elements', () => {
      const { container } = render(<SkeletonCard />);
      const buttons = container.querySelectorAll('button');
      const links = container.querySelectorAll('a');
      expect(buttons).toHaveLength(0);
      expect(links).toHaveLength(0);
    });
  });
});
