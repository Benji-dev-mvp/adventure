# Artisan Component Library - Quick Reference

## Installation & Import

```jsx
// Import individual components
import { Button, Card, Input } from '@/components/ui';

// Or import from specific files
import Button from '@/components/ui/Button';
```

## Core Components Reference

### Buttons

```jsx
// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button loading>Processing...</Button>
<Button disabled>Disabled</Button>

// With Icons
<Button icon={<Icon />}>With Icon</Button>
<Button fullWidth>Full Width</Button>
```

### Form Inputs

```jsx
// Basic Input
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

// With Error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With Helper Text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Textarea
<Textarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>

// Select
<Select
  label="Country"
  options={countries}
  value={selected}
  onChange={setSelected}
/>
```

### Checkboxes & Radios

```jsx
// Checkbox
<Checkbox 
  label="Accept terms" 
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Radio Group
<RadioGroup label="Choose plan" value={plan} onChange={setPlan}>
  <Radio name="plan" label="Free" value="free" />
  <Radio name="plan" label="Pro" value="pro" />
  <Radio name="plan" label="Enterprise" value="enterprise" />
</RadioGroup>

// Switch
<Switch 
  label="Enable notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

### Cards

```jsx
// Basic Card
<Card>
  <h3>Title</h3>
  <p>Content goes here</p>
</Card>

// With Sections
<Card>
  <Card.Header>
    <Card.Title>Dashboard</Card.Title>
    <Card.Description>Welcome back</Card.Description>
  </Card.Header>
  <Card.Content>
    Main content area
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Alerts

```jsx
// Different Variants
<Alert variant="info" title="Information">
  This is an info message
</Alert>

<Alert variant="success" title="Success!">
  Operation completed successfully
</Alert>

<Alert variant="warning" title="Warning">
  Please review before continuing
</Alert>

<Alert variant="error" title="Error" onClose={() => {}}>
  An error occurred
</Alert>
```

### Badges

```jsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="gray">Inactive</Badge>
<Badge variant="purple">Premium</Badge>
```

### Tables

```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow clickable onClick={() => handleClick(item)}>
      <TableCell className="font-medium">John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Accordion

```jsx
<Accordion type="single" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger value="item-1">
      Question 1?
    </AccordionTrigger>
    <AccordionContent value="item-1">
      Answer to question 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger value="item-2">
      Question 2?
    </AccordionTrigger>
    <AccordionContent value="item-2">
      Answer to question 2
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple items open at once
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
  {/* Items */}
</Accordion>
```

### Tooltips

```jsx
<Tooltip content="Helpful tooltip text" position="top">
  <Button>Hover me</Button>
</Tooltip>

// Positions: top, bottom, left, right
<Tooltip content="Info" position="right" delay={500}>
  <Icon />
</Tooltip>
```

### Drawer

```jsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>

<Drawer open={open} onClose={() => setOpen(false)} position="right">
  <DrawerHeader>
    <DrawerTitle>Settings</DrawerTitle>
    <DrawerClose />
  </DrawerHeader>
  <DrawerContent>
    {/* Form or content */}
  </DrawerContent>
  <DrawerFooter>
    <Button onClick={handleSave}>Save</Button>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
  </DrawerFooter>
</Drawer>

// Positions: left, right, top, bottom
```

### Navigation

```jsx
// Breadcrumbs
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem active>Details</BreadcrumbItem>
</Breadcrumb>

// Pagination
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
  showFirstLast
  maxVisible={5}
/>

// Tabs
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Details</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">
    Overview content
  </Tabs.Content>
  <Tabs.Content value="tab2">
    Details content
  </Tabs.Content>
</Tabs>
```

### Loading States

```jsx
// Spinner
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" variant="white" />

// Loading Overlay
<LoadingOverlay loading={isLoading}>
  <Content />
</LoadingOverlay>

// Loading Dots
<LoadingDots />

// Progress Bar
<LoadingBar progress={75} />

// Progress Ring
<Progress value={60} max={100} />
```

### Statistics

```jsx
// Single Stat
<Stat
  label="Total Revenue"
  value="$45,231"
  change="+20.1%"
  trend="up"
  icon={<DollarIcon />}
/>

// Stat Group
<StatGroup>
  <Stat label="Users" value="2,350" trend="up" change="+12%" />
  <Stat label="Revenue" value="$45K" trend="up" change="+20%" />
  <Stat label="Bounce Rate" value="3.2%" trend="down" change="-0.5%" />
  <Stat label="Avg. Time" value="2m 45s" />
</StatGroup>
```

### Empty States

```jsx
<EmptyState
  icon={<CustomIcon />}
  title="No results found"
  description="Try adjusting your search or filters"
  action={
    <Button onClick={handleReset}>Reset Filters</Button>
  }
/>
```

### Avatars

```jsx
<Avatar name="John Doe" size="sm" />
<Avatar name="Jane Smith" size="md" />
<Avatar name="Bob Johnson" size="lg" src="/avatar.jpg" />
<Avatar name="Alice" size="xl" />
```

## Toast Notifications

```jsx
import { useToast } from '@/components/Toast';

function MyComponent() {
  const toast = useToast();

  const handleAction = () => {
    toast.success('Changes saved!');
    toast.error('Failed to save');
    toast.warning('Please review');
    toast.info('New update available');
  };

  return <Button onClick={handleAction}>Save</Button>;
}
```

## Modal & Dialog

```jsx
import { Dialog, Modal } from '@/components/ui';

// Dialog (Radix UI)
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
    </Dialog.Header>
    {/* Content */}
  </Dialog.Content>
</Dialog>

// Custom Modal
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <Modal.Title>Confirm Action</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure?
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
  </Modal.Footer>
</Modal>
```

## Form Validation Pattern

```jsx
import { validateRequired, validateEmail } from '@/lib/validation';

function Form() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!validateRequired(email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Styling Utilities

```jsx
import { cn } from '@/lib/utils';

// Combine classNames conditionally
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isError && "error-classes",
  customClassName
)}>
  Content
</div>
```

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Use `Tab` to navigate between elements
- Use `Enter` or `Space` to activate buttons
- Use `Escape` to close modals/dropdowns

### Screen Readers
- All form inputs have associated labels
- Buttons have descriptive text or aria-labels
- Status messages use aria-live regions
- Complex components include proper ARIA attributes

### Focus Management
```jsx
// Auto-focus on modal open
<Modal autoFocus>
  <Input autoFocus />
</Modal>

// Return focus on close
<Dialog onClose={returnFocus}>
  {/* Content */}
</Dialog>
```

## Dark Mode

All components support dark mode automatically via the `dark:` class strategy:

```jsx
// Manually toggle dark mode
import { useTheme } from '@/contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
```

## Responsive Patterns

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <Card />
  <Card />
</div>

// Hide on mobile
<div className="hidden lg:block">
  Desktop only content
</div>

// Show only on mobile
<div className="block lg:hidden">
  Mobile only content
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card />
  <Card />
  <Card />
  <Card />
</div>
```

## Performance Tips

1. **Lazy Load Pages**: Components are already lazy-loaded in App.jsx
2. **Memoize Callbacks**: Use `useCallback` for event handlers
3. **Memoize Values**: Use `useMemo` for expensive calculations
4. **Virtual Lists**: For long lists, consider react-window
5. **Code Splitting**: Dynamic imports for heavy components

```jsx
// Lazy load heavy component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Testing Components

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui';

test('button click handler', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Common Patterns

### Search with Filters
```jsx
<div className="space-y-4">
  <Input
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <div className="flex gap-2">
    <Badge>Filter 1 ×</Badge>
    <Badge>Filter 2 ×</Badge>
  </div>
  <Table>
    {/* Filtered results */}
  </Table>
</div>
```

### Form with Auto-save
```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    if (formData.title) {
      saveDraft(formData);
      toast.info('Draft saved');
    }
  }, 2000);
  return () => clearTimeout(timer);
}, [formData]);
```

### Confirmation Dialog
```jsx
const [showConfirm, setShowConfirm] = useState(false);

<Button onClick={() => setShowConfirm(true)}>Delete</Button>

<Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
  <Modal.Header>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete this item? This action cannot be undone.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
    <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
  </Modal.Footer>
</Modal>
```

## Component Library Comparison

| Feature | Artisan UI | Material-UI | Chakra UI |
|---------|-----------|-------------|-----------|
| Bundle Size | Small | Large | Medium |
| Customization | High | Medium | High |
| TypeScript | ✓ | ✓ | ✓ |
| Dark Mode | ✓ Native | ✓ Theme | ✓ Native |
| Accessibility | WCAG 2.1 AA | WCAG 2.1 AA | WCAG 2.1 AA |
| Animation | Tailwind | Emotion | Framer Motion |
| Learning Curve | Low | Medium | Low |

## Support & Resources

- **Design System**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **Component Demo**: Visit `/component-showcase` route
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Radix UI Docs**: https://www.radix-ui.com/
- **GitHub Issues**: Report bugs or request features

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: Artisan Platform Team
