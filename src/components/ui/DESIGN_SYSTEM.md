# Artisan Design System

## Overview

Artisan's design system is built on **Tailwind CSS**, **Radix UI primitives**, and **DaisyUI** components, creating a cohesive, accessible, and performant component library.

## Design Principles

1. **Consistency**: Unified visual language across all components
2. **Accessibility**: WCAG 2.1 AA compliant, keyboard navigable
3. **Performance**: Optimized for speed with lazy loading and code splitting
4. **Developer Experience**: Easy to use, well-documented, type-safe
5. **Dark Mode**: Full support via CSS variables and class strategy

## Color System

### Brand Colors

```javascript
primary: {
  DEFAULT: '#0F2540',  // Navy blue - Primary brand
  50-900: /* Light to dark variants */
}

accent: {
  DEFAULT: '#3B82F6',  // Blue - Interactive elements
  50-900: /* Light to dark variants */
}

artisan: {
  purple: '#7D37FF',        // Brand purple
  'purple-dark': '#6A1BE0', // Dark variant
  coral: '#FFAEA5',         // Brand coral
  magenta: '#E91E63',       // Accent magenta
}
```

### Semantic Colors

- **Success**: Green (#10B981)
- **Warning**: Yellow/Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Usage

```jsx
// Background
className = 'bg-primary-500 dark:bg-primary-700';

// Text
className = 'text-accent-600 dark:text-accent-400';

// Border
className = 'border-primary-200 dark:border-primary-800';

// Gradient
className = 'bg-gradient-purple-coral';
```

## Typography

### Font Family

- **Sans**: Inter (primary), system-ui, -apple-system

### Scale

```javascript
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
```

### Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Usage Guidelines

- **Headings**: Use semibold/bold with appropriate size
- **Body**: Regular weight, text-base or text-sm
- **Labels**: Medium weight, text-sm
- **Captions**: Regular, text-xs with muted color

## Spacing System

### Scale

```javascript
0:   0px
px:  1px
0.5: 0.125rem (2px)
1:   0.25rem  (4px)
2:   0.5rem   (8px)
3:   0.75rem  (12px)
4:   1rem     (16px)
5:   1.25rem  (20px)
6:   1.5rem   (24px)
8:   2rem     (32px)
10:  2.5rem   (40px)
12:  3rem     (48px)
16:  4rem     (64px)
```

### Component Spacing Guidelines

- **Button padding**: px-4 py-2 (16px × 8px)
- **Card padding**: p-6 (24px)
- **Section spacing**: space-y-6 or gap-6
- **Form fields**: space-y-4
- **Icons**: mr-2 (8px gap from text)

## Border Radius

```javascript
rounded-none: 0px
rounded-sm:   0.125rem (2px)
rounded:      0.25rem  (4px)
rounded-md:   0.375rem (6px)
rounded-lg:   0.5rem   (8px)
rounded-xl:   0.75rem  (12px)
rounded-2xl:  1rem     (16px)
rounded-full: 9999px
```

### Component Defaults

- **Buttons**: rounded-lg
- **Cards**: rounded-xl
- **Inputs**: rounded-md
- **Badges**: rounded-full
- **Avatars**: rounded-full

## Shadows

```javascript
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
shadow:      0 1px 3px rgba(0,0,0,0.1)
shadow-md:   0 4px 6px rgba(0,0,0,0.1)
shadow-lg:   0 10px 15px rgba(0,0,0,0.1)
shadow-xl:   0 20px 25px rgba(0,0,0,0.1)
shadow-2xl:  0 25px 50px rgba(0,0,0,0.25)
```

### Usage

- **Cards**: shadow-md hover:shadow-lg
- **Modals**: shadow-xl
- **Dropdowns**: shadow-lg
- **Tooltips**: shadow-md

## Component Anatomy

### Button Variants

```jsx
// Primary
<Button variant="primary">Action</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Outline
<Button variant="outline">Learn More</Button>

// Ghost
<Button variant="ghost">Skip</Button>

// Danger
<Button variant="danger">Delete</Button>
```

### Button Sizes

```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  // Default
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Card Layouts

```jsx
// Basic Card
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>{/* Content */}</Card.Content>
  <Card.Footer>{/* Actions */}</Card.Footer>
</Card>
```

## Accessibility

### Keyboard Navigation

- **Tab**: Move focus forward
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate button/toggle
- **Escape**: Close modal/dropdown
- **Arrow Keys**: Navigate lists/menus

### ARIA Attributes

Always include:

- `aria-label` for icon-only buttons
- `aria-describedby` for form errors
- `aria-expanded` for collapsible content
- `aria-live` for dynamic updates
- `role` attributes where semantic HTML isn't sufficient

### Focus Management

```jsx
// Focus visible only on keyboard navigation
className = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500';
```

## Animation & Transitions

### Duration

```javascript
transition-none:   0ms
transition-all:    150ms
transition-colors: 150ms
transition-opacity: 150ms
transition-transform: 150ms
```

### Easing

- **Default**: ease-in-out
- **Enter**: ease-out
- **Exit**: ease-in

### Usage

```jsx
// Hover effects
className = 'transition-all hover:scale-105';

// Color changes
className = 'transition-colors hover:bg-accent-600';

// Fade in/out
className = 'transition-opacity duration-300';
```

## Responsive Design

### Breakpoints

```javascript
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large
```

### Mobile-First Approach

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  {/* Items */}
</div>

// Hide on mobile
<div className="hidden lg:block">
  {/* Desktop-only content */}
</div>
```

## Dark Mode

### Implementation

Dark mode uses the `class` strategy. Toggle by adding/removing `dark` class on root element.

```jsx
// Component example
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Content</div>
```

### Best Practices

- Always define both light and dark variants
- Test contrast ratios in both modes
- Use semantic color names (background, foreground, muted)
- Adjust opacity for subtle effects

## Component Checklist

When creating new components, ensure:

- [ ] TypeScript props interface
- [ ] Forwarded refs where applicable
- [ ] Accessible markup (semantic HTML)
- [ ] Keyboard navigation support
- [ ] ARIA attributes
- [ ] Dark mode support
- [ ] Responsive behavior
- [ ] Loading/disabled states
- [ ] Error states
- [ ] Focus management
- [ ] Proper z-index layering
- [ ] Transition/animation
- [ ] Documentation with examples

## File Organization

```
src/components/ui/
├── Button.jsx          // Primary interactive element
├── Card.jsx            // Container component
├── Input.jsx           // Form input
├── Select.jsx          // Dropdown select
├── Dialog.jsx          // Modal dialogs
├── Tabs.jsx            // Tab navigation
├── Badge.jsx           // Status indicators
├── Avatar.jsx          // User images
├── Toast.jsx           // Notifications
├── Progress.jsx        // Loading indicators
├── Checkbox.jsx        // Form checkbox
├── Radio.jsx           // Form radio
├── Switch.jsx          // Toggle switch
├── Tooltip.jsx         // Hover info
├── Alert.jsx           // Inline messages
├── Table.jsx           // Data tables
├── Accordion.jsx       // Collapsible sections
├── Breadcrumb.jsx      // Navigation trail
└── DESIGN_SYSTEM.md    // This file
```

## Usage Examples

### Form with Validation

```jsx
import { Input, Button, Alert } from '@/components/ui';

function ContactForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <form className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={error}
        required
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Button type="submit" fullWidth>
        Submit
      </Button>
    </form>
  );
}
```

### Data Dashboard Card

```jsx
import { Card, Badge, Button } from '@/components/ui';

function MetricCard({ title, value, change, trend }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={trend === 'up' ? 'success' : 'danger'}>{change}</Badge>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      </Card.Content>
    </Card>
  );
}
```

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [DaisyUI Components](https://daisyui.com/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
