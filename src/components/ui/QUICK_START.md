# 🚀 Artisan Component Library - 5-Minute Quick Start

## Get Started in 3 Steps

### 1. Import Components
```jsx
import { Button, Card, Input, Badge } from '@/components/ui';
```

### 2. Use in Your Code
```jsx
function MyPage() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome to Artisan</Card.Title>
        <Badge variant="success">Live</Badge>
      </Card.Header>
      <Card.Content>
        <Input label="Email" placeholder="you@example.com" />
      </Card.Content>
      <Card.Footer>
        <Button variant="primary">Get Started</Button>
      </Card.Footer>
    </Card>
  );
}
```

### 3. Customize with Props
```jsx
// Button variants and sizes
<Button variant="primary" size="lg">Primary Large</Button>
<Button variant="outline" size="sm">Outline Small</Button>

// Input with validation
<Input 
  label="Email" 
  type="email"
  error="Invalid email"
  required
/>

// Badge colors
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
```

## 📖 Essential Components

### Forms
```jsx
// Text Input
<Input label="Name" placeholder="John Doe" />

// Textarea
<Textarea label="Message" rows={4} />

// Checkbox
<Checkbox label="I agree to terms" />

// Radio Group
<RadioGroup label="Plan">
  <Radio name="plan" label="Free" value="free" />
  <Radio name="plan" label="Pro" value="pro" />
</RadioGroup>

// Switch
<Switch label="Enable notifications" />
```

### Feedback
```jsx
// Alert
<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

// Toast (use the hook)
import { useToast } from '@/components/Toast';
const toast = useToast();
toast.success('Saved!');

// Spinner
<Spinner size="md" />
```

### Layout
```jsx
// Card
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Actions</Card.Footer>
</Card>

// Stats
<StatGroup>
  <Stat label="Revenue" value="$45K" trend="up" change="+20%" />
  <Stat label="Users" value="2,350" trend="up" change="+12%" />
</StatGroup>
```

### Navigation
```jsx
// Breadcrumbs
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem active>Current</BreadcrumbItem>
</Breadcrumb>

// Pagination
<Pagination 
  currentPage={1} 
  totalPages={10} 
  onPageChange={setPage} 
/>

// Tabs
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

### Overlays
```jsx
// Drawer
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>

<Drawer open={open} onClose={() => setOpen(false)}>
  <DrawerHeader>
    <DrawerTitle>Title</DrawerTitle>
    <DrawerClose />
  </DrawerHeader>
  <DrawerContent>
    Content goes here
  </DrawerContent>
  <DrawerFooter>
    <Button>Save</Button>
  </DrawerFooter>
</Drawer>

// Tooltip
<Tooltip content="Helpful hint">
  <Button>Hover me</Button>
</Tooltip>
```

### Data Display
```jsx
// Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

// Empty State
<EmptyState
  title="No data"
  description="Get started by adding items"
  action={<Button>Add Item</Button>}
/>
```

## 🎨 Common Patterns

### Login Form
```jsx
import { Input, Button, Card } from '@/components/ui';
import { useToast } from '@/components/Toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic
    toast.success('Logged in successfully!');
  };

  return (
    <Card className="max-w-md mx-auto">
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" fullWidth>
            Sign In
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}
```

### Dashboard Stats
```jsx
import { StatGroup, Stat } from '@/components/ui';

function DashboardStats() {
  return (
    <StatGroup>
      <Stat
        label="Total Revenue"
        value="$45,231"
        change="+20.1%"
        trend="up"
        icon={<DollarIcon />}
      />
      <Stat
        label="Active Users"
        value="2,350"
        change="+180"
        trend="up"
      />
      <Stat
        label="Conversion Rate"
        value="3.65%"
        change="-0.5%"
        trend="down"
      />
      <Stat
        label="Avg. Response Time"
        value="1.2s"
        change="+0.3s"
        trend="down"
      />
    </StatGroup>
  );
}
```

### Data Table with Actions
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from '@/components/ui';

function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge variant={user.active ? 'success' : 'gray'}>
                {user.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost">Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Settings Panel with Drawer
```jsx
import { Drawer, DrawerHeader, DrawerTitle, DrawerClose, DrawerContent, DrawerFooter, Input, Switch, Button } from '@/components/ui';

function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <DrawerContent>
          <div className="space-y-6">
            <Input label="Display Name" defaultValue="John Doe" />
            <Input label="Email" type="email" defaultValue="john@example.com" />
            <Switch
              label="Email Notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Switch label="Dark Mode" />
          </div>
        </DrawerContent>
        <DrawerFooter>
          <Button variant="primary">Save Changes</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
```

## 🌗 Dark Mode

Toggle dark mode with the theme context:

```jsx
import { useTheme } from '@/contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </Button>
  );
}
```

All components automatically support dark mode!

## 📱 Responsive Design

Use Tailwind breakpoints for responsive layouts:

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <Card className="w-full md:w-1/2">Left</Card>
  <Card className="w-full md:w-1/2">Right</Card>
</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Show only on mobile
<div className="block lg:hidden">
  Mobile only content
</div>
```

## 🔥 Pro Tips

1. **Use the `cn()` utility for conditional classes**
   ```jsx
   import { cn } from '@/lib/utils';
   
   <Button className={cn(
     "base-class",
     isActive && "active-class",
     isError && "error-class"
   )}>
     Click me
   </Button>
   ```

2. **Combine with Tailwind utilities**
   ```jsx
   <Button className="w-full sm:w-auto mt-4">
     Responsive Button
   </Button>
   ```

3. **Use toast for quick feedback**
   ```jsx
   const toast = useToast();
   
   const handleSave = async () => {
     try {
       await save();
       toast.success('Saved successfully!');
     } catch (error) {
       toast.error('Failed to save');
     }
   };
   ```

4. **Compose components for complex UIs**
   ```jsx
   <Card>
     <Card.Header>
       <div className="flex items-center justify-between">
         <Card.Title>Users</Card.Title>
         <Badge variant="info">{users.length}</Badge>
       </div>
     </Card.Header>
     <Card.Content>
       <Table>
         {/* Table content */}
       </Table>
     </Card.Content>
     <Card.Footer>
       <Pagination {...paginationProps} />
     </Card.Footer>
   </Card>
   ```

## 📚 Learn More

- **Full Documentation**: [README.md](./README.md)
- **Design System**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **API Reference**: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
- **Live Demo**: Visit `/component-showcase`

## 🆘 Need Help?

- Check the [Component Guide](./COMPONENT_GUIDE.md) for detailed API docs
- Visit the [Component Showcase](/component-showcase) for live examples
- Review [Design System](./DESIGN_SYSTEM.md) for styling guidelines

---

**Ready to build amazing UIs with Artisan Components! 🚀**
