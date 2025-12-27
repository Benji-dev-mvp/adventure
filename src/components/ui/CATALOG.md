# 📋 Artisan Component Catalog

Quick reference for all available components with import paths and basic usage.

## Form Components

| Component | Import | Usage |
|-----------|--------|-------|
| **Button** | `import { Button } from '@/components/ui'` | `<Button variant="primary">Click</Button>` |
| **Input** | `import { Input } from '@/components/ui'` | `<Input label="Email" type="email" />` |
| **Textarea** | `import { Textarea } from '@/components/ui'` | `<Textarea label="Message" rows={4} />` |
| **Select** | `import { Select } from '@/components/ui'` | `<Select options={opts} value={val} />` |
| **Checkbox** | `import { Checkbox } from '@/components/ui'` | `<Checkbox label="Agree" />` |
| **Radio** | `import { Radio, RadioGroup } from '@/components/ui'` | `<RadioGroup><Radio label="A" /></RadioGroup>` |
| **Switch** | `import { Switch } from '@/components/ui'` | `<Switch label="Enable" checked={on} />` |

## Data Display

| Component | Import | Usage |
|-----------|--------|-------|
| **Table** | `import { Table, TableHeader, TableBody } from '@/components/ui'` | `<Table><TableHeader>...</TableHeader></Table>` |
| **Card** | `import { Card } from '@/components/ui'` | `<Card><Card.Header>...</Card.Header></Card>` |
| **Badge** | `import { Badge } from '@/components/ui'` | `<Badge variant="success">Active</Badge>` |
| **Avatar** | `import { Avatar } from '@/components/ui'` | `<Avatar name="John Doe" size="md" />` |
| **Stat** | `import { Stat, StatGroup } from '@/components/ui'` | `<Stat label="Revenue" value="$45K" />` |
| **EmptyState** | `import { EmptyState } from '@/components/ui'` | `<EmptyState title="No data" />` |

## Feedback

| Component | Import | Usage |
|-----------|--------|-------|
| **Alert** | `import { Alert } from '@/components/ui'` | `<Alert variant="success">Message</Alert>` |
| **Toast** | `import { useToast } from '@/components/Toast'` | `toast.success('Saved!')` |
| **Spinner** | `import { Spinner } from '@/components/ui'` | `<Spinner size="md" />` |
| **Progress** | `import { Progress } from '@/components/ui'` | `<Progress value={60} max={100} />` |
| **LoadingBar** | `import { LoadingBar } from '@/components/ui'` | `<LoadingBar progress={75} />` |
| **LoadingDots** | `import { LoadingDots } from '@/components/ui'` | `<LoadingDots />` |
| **Skeleton** | `import { Skeleton } from '@/components/ui'` | `<Skeleton className="h-20 w-full" />` |

## Navigation

| Component | Import | Usage |
|-----------|--------|-------|
| **Breadcrumb** | `import { Breadcrumb, BreadcrumbItem } from '@/components/ui'` | `<Breadcrumb><BreadcrumbItem>Home</BreadcrumbItem></Breadcrumb>` |
| **Pagination** | `import { Pagination } from '@/components/ui'` | `<Pagination currentPage={1} totalPages={10} />` |
| **Tabs** | `import { Tabs } from '@/components/ui'` | `<Tabs defaultValue="tab1">...</Tabs>` |

## Overlays

| Component | Import | Usage |
|-----------|--------|-------|
| **Dialog** | `import { Dialog } from '@/components/ui'` | `<Dialog open={open}>...</Dialog>` |
| **Modal** | `import { Modal } from '@/components/ui'` | `<Modal isOpen={open}>...</Modal>` |
| **Drawer** | `import { Drawer } from '@/components/ui'` | `<Drawer open={open} position="right">...</Drawer>` |
| **Tooltip** | `import { Tooltip } from '@/components/ui'` | `<Tooltip content="Info"><Button>Hover</Button></Tooltip>` |
| **Popover** | `import { Popover } from '@/components/ui'` | `<Popover>...</Popover>` |
| **DropdownMenu** | `import { DropdownMenu } from '@/components/ui'` | `<DropdownMenu>...</DropdownMenu>` |

## Interactive

| Component | Import | Usage |
|-----------|--------|-------|
| **Accordion** | `import { Accordion, AccordionItem } from '@/components/ui'` | `<Accordion><AccordionItem>...</AccordionItem></Accordion>` |
| **AnimatedButton** | `import { AnimatedButton } from '@/components/ui'` | `<AnimatedButton>Click</AnimatedButton>` |
| **Command** | `import { Command } from '@/components/ui'` | `<Command>...</Command>` |

## Layout

| Component | Import | Usage |
|-----------|--------|-------|
| **Separator** | `import { Separator } from '@/components/ui'` | `<Separator />` |

## Variants Quick Reference

### Button Variants
```jsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

### Button Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Alert Variants
```jsx
<Alert variant="info">Info</Alert>
<Alert variant="success">Success</Alert>
<Alert variant="warning">Warning</Alert>
<Alert variant="error">Error</Alert>
```

### Badge Variants
```jsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="gray">Gray</Badge>
<Badge variant="purple">Purple</Badge>
```

### Avatar Sizes
```jsx
<Avatar size="sm" name="John" />
<Avatar size="md" name="Jane" />
<Avatar size="lg" name="Bob" />
<Avatar size="xl" name="Alice" />
```

### Spinner Sizes & Variants
```jsx
<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" variant="white" />
<Spinner size="xl" variant="gray" />
```

### Drawer Positions
```jsx
<Drawer position="left">...</Drawer>
<Drawer position="right">...</Drawer>
<Drawer position="top">...</Drawer>
<Drawer position="bottom">...</Drawer>
```

### Tooltip Positions
```jsx
<Tooltip position="top">...</Tooltip>
<Tooltip position="bottom">...</Tooltip>
<Tooltip position="left">...</Tooltip>
<Tooltip position="right">...</Tooltip>
```

## Common Prop Patterns

### className
All components accept `className` for custom styling:
```jsx
<Button className="w-full mt-4">Full Width</Button>
<Card className="max-w-md mx-auto">Centered Card</Card>
```

### disabled
Form components support `disabled` state:
```jsx
<Button disabled>Disabled</Button>
<Input disabled />
<Checkbox disabled />
```

### error
Form components support error messages:
```jsx
<Input error="Invalid email" />
<Textarea error="Too short" />
<Checkbox error="Required" />
```

### required
Form components support required indicator:
```jsx
<Input label="Email" required />
<Textarea label="Message" required />
```

### fullWidth
Some components support full width:
```jsx
<Button fullWidth>Full Width Button</Button>
<Input fullWidth />
```

## Component Composition

### Card Structure
```jsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
  <Card.Footer>
    {/* Actions */}
  </Card.Footer>
</Card>
```

### Table Structure
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Footer</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Accordion Structure
```jsx
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger value="item-1">
      Question?
    </AccordionTrigger>
    <AccordionContent value="item-1">
      Answer
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Drawer Structure
```jsx
<Drawer open={open} onClose={handleClose}>
  <DrawerHeader>
    <DrawerTitle>Title</DrawerTitle>
    <DrawerClose />
  </DrawerHeader>
  <DrawerContent>
    {/* Content */}
  </DrawerContent>
  <DrawerFooter>
    {/* Actions */}
  </DrawerFooter>
</Drawer>
```

### StatGroup Structure
```jsx
<StatGroup>
  <Stat label="Metric 1" value="100" />
  <Stat label="Metric 2" value="200" />
  <Stat label="Metric 3" value="300" />
  <Stat label="Metric 4" value="400" />
</StatGroup>
```

## Import Shortcuts

### Single Import
```jsx
import { Button } from '@/components/ui';
```

### Multiple Imports
```jsx
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Alert 
} from '@/components/ui';
```

### Specific Component Import
```jsx
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### Hook Imports
```jsx
import { useToast } from '@/components/Toast';
import { useTheme } from '@/contexts/ThemeContext';
```

## Styling Utilities

### cn() Helper
Combine classNames conditionally:
```jsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  isActive && "active-class",
  isError && "error-class",
  customClassName
)}>
  Content
</div>
```

### Tailwind Utilities
```jsx
// Spacing
<div className="p-4 mt-6 mb-8">...</div>

// Colors
<div className="bg-primary-500 text-white">...</div>

// Dark mode
<div className="bg-white dark:bg-gray-900">...</div>

// Responsive
<div className="flex flex-col md:flex-row">...</div>
```

## Testing Imports

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, Card } from '@/components/ui';
```

## Live Examples

Visit `/component-showcase` to see all components in action with interactive examples!

---

**Component Count**: 40+  
**Last Updated**: December 2025  
**Version**: 1.0.0
