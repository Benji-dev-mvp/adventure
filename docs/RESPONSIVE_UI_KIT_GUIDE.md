# Responsive Dashboard UI Kit - Complete Implementation Guide

## 🎯 Overview

A comprehensive, 100% responsive dashboard UI kit built for the Artisan platform. Every component is mobile-first and fully responsive across all devices (mobile, tablet, desktop, 4K).

## 📦 Components Library

### Layout System (`GridSystem.jsx`)

#### GridContainer
Responsive container with standard padding and max-width.

```jsx
import { GridContainer } from '../components/ui/ResponsiveDashboardKit';

<GridContainer>
  {/* Content automatically centered with responsive padding */}
</GridContainer>
```

#### ResponsiveGrid
Auto-responsive grid with column control per breakpoint.

```jsx
<ResponsiveGrid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</ResponsiveGrid>
```

#### GridRow & GridCol
12-column grid system like Bootstrap.

```jsx
<GridRow gap="lg">
  <GridCol xs={12} md={6} lg={4}>
    <Card>Column 1</Card>
  </GridCol>
  <GridCol xs={12} md={6} lg={8}>
    <Card>Column 2</Card>
  </GridCol>
</GridRow>
```

#### FlexContainer
Flexible layout with responsive alignment.

```jsx
<FlexContainer direction="row" justify="between" align="center" wrap gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
</FlexContainer>
```

---

### Dashboard Widgets (`DashboardWidgets.jsx`)

#### KPICard
Key performance indicator with animated counter.

```jsx
import { KPICard } from '../components/ui/ResponsiveDashboardKit';
import { DollarSign } from 'lucide-react';

<KPICard
  title="Total Revenue"
  value={245680}
  change={12.5}
  trend="up"
  format="currency" // 'currency', 'percentage', 'number'
  icon={DollarSign}
/>
```

**Props:**
- `title` (string) - KPI label
- `value` (number) - Current value
- `change` (number, optional) - Percentage change
- `trend` ('up' | 'down' | 'neutral') - Trend indicator
- `format` ('currency' | 'percentage' | 'number') - Value formatting
- `icon` (LucideIcon) - Icon component

#### StatsWidget
Multi-metric display card.

```jsx
<StatsWidget
  title="This Week's Performance"
  stats={[
    { label: 'Emails Sent', value: '2,543', subtext: '+12% from last week' },
    { label: 'Open Rate', value: '34.2%', subtext: 'Above average' },
    { label: 'Click Rate', value: '12.8%', subtext: 'Excellent' }
  ]}
/>
```

#### ProgressRing
Circular progress indicator.

```jsx
<ProgressRing
  value={75}
  max={100}
  size="md" // 'sm', 'md', 'lg', 'xl'
  color="blue" // 'blue', 'green', 'purple', 'red', 'yellow'
  label="Completion"
  showValue={true}
/>
```

#### Gauge
Speedometer-style gauge.

```jsx
<Gauge
  value={84}
  min={0}
  max={100}
  label="Performance Score"
  size="md"
  thresholds={{ low: 33, medium: 66 }}
/>
```

#### MetricCard
Compact metric display with trend.

```jsx
<MetricCard
  label="Page Views"
  value="24.5K"
  change="+12.5%"
  trend="up"
  icon={Eye}
/>
```

---

### Navigation Components (`NavigationComponents.jsx`)

#### ResponsiveSidebar
Mobile-responsive sidebar with drawer on mobile.

```jsx
<ResponsiveSidebar
  items={[
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Leads', path: '/leads', badge: 5 }
  ]}
  logo={<Logo />}
  collapsed={false}
/>
```

**Features:**
- Automatic mobile drawer
- Badge support
- Active route highlighting
- Collapsible on desktop

#### TopBar
Sticky header with breadcrumbs and actions.

```jsx
<TopBar
  title="Dashboard Overview"
  subtitle="Welcome back!"
  breadcrumbs={[
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' }
  ]}
  actions={[
    <Button key="new">New Campaign</Button>
  ]}
/>
```

#### MegaMenu
Multi-column dropdown menu.

```jsx
<MegaMenu
  trigger={<span>Products</span>}
  categories={[
    {
      title: 'Features',
      items: [
        { label: 'AI Assistant', path: '/ava', icon: Brain },
        { label: 'Analytics', path: '/analytics', icon: BarChart }
      ]
    }
  ]}
/>
```

---

### Data Display (`DataTableResponsive.jsx`)

#### DataTable
Full-featured responsive table with mobile card view.

```jsx
const columns = [
  { accessor: 'name', label: 'Name', sortable: true },
  { accessor: 'status', label: 'Status', render: (val) => <Badge>{val}</Badge> },
  { accessor: 'value', label: 'Value', sortable: true }
];

const data = [
  { name: 'Item 1', status: 'active', value: 100 },
  { name: 'Item 2', status: 'pending', value: 200 }
];

<DataTable
  columns={columns}
  data={data}
  searchable
  filterable
  exportable
  pagination
  pageSize={10}
  mobileCardView
  onRowClick={(row) => console.log(row)}
  actions={(row) => (
    <TableActions
      onView={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  )}
/>
```

**Features:**
- Responsive: Desktop table, mobile cards
- Built-in search and filtering
- CSV export
- Pagination
- Row actions
- Sort by column
- Custom cell rendering

---

### Interactive Components (`InteractiveComponents.jsx`)

#### ResponsiveModal
Full-screen on mobile, centered on desktop.

```jsx
<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Item"
  description="Make changes to your item"
  size="lg" // 'sm', 'md', 'lg', 'xl', 'full'
  closeOnOverlay={true}
  footer={
    <>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button onClick={onSave}>Save Changes</Button>
    </>
  }
>
  <FormContent />
</ResponsiveModal>
```

#### Drawer
Slide-in panel from any direction.

```jsx
<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="right" // 'left', 'right', 'top', 'bottom'
  size="md"
  title="Filters"
  footer={<Button>Apply Filters</Button>}
>
  <FilterForm />
</Drawer>
```

#### NotificationToast
Auto-dismissing toast notifications.

```jsx
<NotificationToast
  type="success" // 'info', 'success', 'warning', 'error'
  title="Campaign launched!"
  message="Your campaign is now active"
  duration={5000}
  onClose={() => {}}
  position="top-right"
  action={{
    label: 'View Campaign',
    onClick: () => navigate('/campaigns')
  }}
/>
```

#### AlertBanner
Persistent banner for important messages.

```jsx
<AlertBanner
  type="warning"
  title="Action Required"
  message="Please verify your email address"
  dismissible
  onDismiss={() => {}}
  action={{
    label: 'Verify Now',
    onClick: () => {}
  }}
/>
```

---

### Project Management (`ProjectWidgets.jsx`)

#### TaskList
Interactive task list with add/complete/delete.

```jsx
const [tasks, setTasks] = useState([
  { title: 'Review campaign metrics', completed: false, dueDate: 'Dec 28' },
  { title: 'Update lead list', completed: true }
]);

<TaskList
  tasks={tasks}
  onUpdate={setTasks}
  onDelete={(index) => {}}
  onAdd={(task) => {}}
/>
```

#### ProjectCard
Project overview card with progress.

```jsx
<ProjectCard
  project={{
    name: 'Q4 Campaign',
    category: 'Sales',
    description: 'End of year push',
    totalTasks: 25,
    completedTasks: 18,
    members: 5,
    dueDate: 'Dec 31',
    priority: 'high' // 'high', 'medium', 'low'
  }}
  onView={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

#### CalendarWidget
Monthly calendar with events.

```jsx
<CalendarWidget
  events={[
    { title: 'Product Demo', date: '2025-12-28', color: 'bg-blue-600' },
    { title: 'Team Sync', date: '2025-12-29', color: 'bg-green-600' }
  ]}
/>
```

#### ActivityLog
Timeline of activities.

```jsx
<ActivityLog
  activities={[
    {
      title: 'New lead replied',
      description: 'Sarah Chen responded',
      time: '2 minutes ago',
      icon: Mail,
      color: 'bg-blue-600'
    }
  ]}
/>
```

#### StatusBadge
Colored status indicator.

```jsx
<StatusBadge
  status="active" // 'active', 'inactive', 'pending', 'completed', 'error'
  size="md" // 'sm', 'md', 'lg'
/>
```

---

### Media Components (`MediaComponents.jsx`)

#### ImageGallery
Responsive gallery with lightbox.

```jsx
<ImageGallery
  images={[
    { url: '/image1.jpg', title: 'Dashboard', alt: 'Dashboard view' },
    { url: '/image2.jpg', title: 'Analytics' }
  ]}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
/>
```

**Features:**
- Lightbox with keyboard navigation
- Touch swipe support
- Responsive grid
- Image titles/captions

#### Carousel
Auto-playing carousel with touch support.

```jsx
<Carousel
  items={[
    {
      type: 'image',
      src: '/slide1.jpg',
      title: 'Welcome',
      description: 'Get started today'
    },
    {
      type: 'custom',
      content: <CustomComponent />
    }
  ]}
  autoPlay={true}
  interval={5000}
/>
```

**Features:**
- Auto-play option
- Touch/swipe navigation
- Dot indicators
- Custom content support

#### VideoEmbed
HTML5 video player.

```jsx
<VideoEmbed
  src="/video.mp4"
  poster="/thumbnail.jpg"
  title="Product Demo"
  controls={true}
  autoplay={false}
/>
```

#### VideoIframe
YouTube/Vimeo embed.

```jsx
<VideoIframe
  url="https://youtube.com/embed/..."
  title="Tutorial"
  aspectRatio="16/9"
/>
```

---

## 🎨 Responsive Breakpoints

All components follow these breakpoints:

```javascript
xs:  0px    (mobile)
sm:  640px  (tablet portrait)
md:  768px  (tablet landscape)
lg:  1024px (desktop)
xl:  1280px (large desktop)
2xl: 1536px (4K)
```

---

## 🚀 Quick Start Example

```jsx
import React from 'react';
import {
  GridContainer,
  ResponsiveGrid,
  KPICard,
  DataTable,
  ProjectCard
} from '../components/ui/ResponsiveDashboardKit';
import { DollarSign, Users, Mail } from 'lucide-react';

const MyDashboard = () => {
  return (
    <GridContainer className="py-6">
      {/* KPI Cards */}
      <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md" className="mb-8">
        <KPICard title="Revenue" value={245680} format="currency" icon={DollarSign} />
        <KPICard title="Leads" value={1284} format="number" icon={Users} />
        <KPICard title="Reply Rate" value={8.4} format="percentage" icon={Mail} />
      </ResponsiveGrid>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        searchable
        pagination
        mobileCardView
      />

      {/* Project Cards */}
      <ResponsiveGrid cols={{ xs: 1, md: 2, lg: 3 }} gap="md">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ResponsiveGrid>
    </GridContainer>
  );
};
```

---

## 📱 Mobile Optimization

### Automatic Mobile Features:
- **DataTable**: Switches to card view on mobile
- **Modals**: Full-screen on mobile, centered on desktop
- **Sidebar**: Drawer overlay on mobile
- **Navigation**: Hamburger menu on mobile
- **Carousel**: Touch swipe gestures
- **Gallery**: Touch lightbox navigation

### Touch Gestures:
- Swipe left/right for carousels
- Pinch to zoom in galleries
- Tap to open/close drawers

---

## 🌙 Dark Mode Support

All components automatically support dark mode via Tailwind's `dark:` classes. No additional configuration needed.

```jsx
// Dark mode is handled automatically
<KPICard title="Revenue" value={100000} />
// Renders correctly in both light and dark themes
```

---

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements support Tab/Enter/Escape
- **ARIA Labels**: Semantic HTML with proper ARIA attributes
- **Focus Indicators**: Visible focus states
- **Screen Reader Support**: Descriptive labels and announcements
- **Color Contrast**: WCAG AA compliant

---

## 🎭 Usage in Existing Pages

See [EnhancedDashboard.jsx](../pages/EnhancedDashboard.jsx) for a complete implementation example.

Access at: `http://localhost:3004/dashboard-enhanced`

---

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)

---

## 🐛 Troubleshooting

### Components not showing up?
Make sure to import from the main export file:
```jsx
import { KPICard, DataTable } from '../components/ui/ResponsiveDashboardKit';
```

### Styling issues?
Ensure Tailwind is scanning the new component files in `tailwind.config.js`:
```js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
```

### Mobile view not working?
Check that viewport meta tag is in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 💡 Best Practices

1. **Always use GridContainer** for consistent spacing
2. **Prefer ResponsiveGrid** over manual grid classes
3. **Test on mobile devices**, not just browser DevTools
4. **Use semantic breakpoints**: Start mobile-first (xs), then add larger breakpoints
5. **Leverage mobileCardView** for data tables on small screens
6. **Keep modals size='md'** unless you need more space
7. **Use StatusBadge** for consistent status indicators
8. **Include loading states** for async operations

---

Built with ❤️ for Artisan Platform
