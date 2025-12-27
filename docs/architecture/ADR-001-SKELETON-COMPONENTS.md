# ADR-001: Comprehensive Skeleton Loading Component Library

**Status**: Implemented  
**Date**: 2025-12-27  
**Decision Makers**: Development Team  
**Technical Story**: Fix broken skeleton component tests and improve loading UX

## Context

The application had skeleton loading component tests that were failing because the implementation was incomplete. The tests expected multiple skeleton variants (SkeletonGroup, SkeletonCard, SkeletonTable, SkeletonList, SkeletonDashboard) but only a basic Skeleton component existed.

Additionally, the exports were inconsistent:
- `components/index.js` tried to export skeleton components from `Loading.jsx`
- `Loading.jsx` only contained spinner components, not skeleton components
- Duplicate files existed: `Skeleton.jsx` and `skeleton.jsx` (case sensitivity issue)

## Decision

We decided to implement a complete skeleton loading component library with:

1. **Base Skeleton Component** with multiple variants:
   - default (generic rectangular skeleton)
   - text (short text line)
   - title (larger text line for headings)
   - avatar (circular for profile pictures)
   - button (button-sized skeleton)
   - card (card-sized skeleton)

2. **Specialized Skeleton Components**:
   - `SkeletonGroup` - Renders multiple skeletons with spacing
   - `SkeletonCard` - Pre-built card layout with title, text, and buttons
   - `SkeletonTable` - Table skeleton with configurable rows and columns
   - `SkeletonList` - List items with avatar and text
   - `SkeletonDashboard` - Complete dashboard skeleton layout

3. **Design Principles**:
   - Use Tailwind CSS for styling consistency
   - Support dark mode out of the box
   - Make all components composable and customizable
   - Use semantic HTML (div elements)
   - Follow existing project patterns (cn utility, @/lib/utils imports)

## Implementation

### File Structure
```
src/
  components/
    ui/
      Skeleton.jsx          # All skeleton components
    index.js                # Updated exports
    Loading.jsx             # Spinner components only
```

### Key Changes

**1. Removed duplicate file**: `skeleton.jsx` (lowercase)

**2. Implemented comprehensive Skeleton.jsx**:
```jsx
// Base component with variant support
function Skeleton({ variant = 'default', className, ...props })

// Specialized components
function SkeletonGroup({ count = 3, className, children, ...props })
function SkeletonCard({ className, ...props })
function SkeletonTable({ rows = 5, columns = 4, className, ...props })
function SkeletonList({ items = 5, className, ...props })
function SkeletonDashboard({ className, ...props })
```

**3. Fixed exports in components/index.js**:
```javascript
// Before
export { ..., Skeleton, SkeletonText, SkeletonCard, ... } from './Loading';

// After
export { Skeleton, SkeletonGroup, SkeletonCard, SkeletonTable, 
         SkeletonList, SkeletonDashboard } from './ui/Skeleton';
export { PageLoader, InlineLoader, LoadingSpinner } from './Loading';
```

## Consequences

### Positive
- ✅ All 22 skeleton component tests now pass
- ✅ Improved loading states throughout the application
- ✅ Consistent skeleton patterns across features
- ✅ Better perceived performance for users
- ✅ Dark mode support built-in
- ✅ Reusable and composable components
- ✅ Clean separation between skeleton and spinner components

### Negative
- None identified

### Neutral
- Developers now have multiple loading UI options to choose from:
  - Use `LoadingSpinner` for simple loading indicators
  - Use `Skeleton` components for content placeholders
  - Use `PageLoader` for full-page loading states

## Usage Examples

### Basic Skeleton
```jsx
import { Skeleton } from '@/components';

<Skeleton variant="text" />
<Skeleton variant="avatar" />
<Skeleton variant="button" />
```

### Skeleton Group
```jsx
import { SkeletonGroup } from '@/components';

<SkeletonGroup count={5} />
```

### Pre-built Layouts
```jsx
import { SkeletonCard, SkeletonTable, SkeletonDashboard } from '@/components';

// Loading card
<SkeletonCard />

// Loading table with custom dimensions
<SkeletonTable rows={10} columns={6} />

// Loading entire dashboard
<SkeletonDashboard />
```

### In Practice
```jsx
function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  if (loading) {
    return <SkeletonTable rows={10} columns={5} />;
  }

  return <LeadsTable data={leads} />;
}
```

## Alternatives Considered

### 1. Use Third-party Library
**Option**: Install react-loading-skeleton or similar library

**Rejected Because**:
- Adds unnecessary dependency
- Our needs are simple and well-defined
- Custom implementation is <150 lines of code
- Better integration with our design system

### 2. Keep Minimal Implementation
**Option**: Only implement basic Skeleton and fix tests

**Rejected Because**:
- Tests were already written expecting full implementation
- Pre-built patterns (SkeletonCard, SkeletonTable) save time
- Consistency across the app requires standardized patterns

### 3. Use CSS Loading Animations Only
**Option**: Use pure CSS shimmer effects without components

**Rejected Because**:
- Less maintainable
- Harder to ensure consistency
- Doesn't work well with dark mode
- Component-based approach is more React-idiomatic

## References

- Original test file: `src/__tests__/skeleton.test.jsx`
- Implementation: `src/components/ui/Skeleton.jsx`
- Related ADRs: None (first ADR)
- Design inspiration: Shadcn/ui skeleton component

## Notes

This implementation follows the Shadcn/ui pattern which is already used in other parts of the codebase (see `ui/` components). This ensures consistency and leverages the existing `cn()` utility from `lib/utils.js`.

The components are intentionally simple and focused on structure rather than advanced animations, as complex animations can actually harm perceived performance on slower devices.
