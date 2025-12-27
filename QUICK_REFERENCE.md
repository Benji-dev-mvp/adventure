# 🚀 Quick Reference - Responsive Dashboard UI Kit

## Import All Components
```jsx
import {
  // Layout
  GridContainer, GridRow, GridCol, ResponsiveGrid, FlexContainer,
  
  // Widgets
  KPICard, StatsWidget, ProgressRing, Gauge, MetricCard,
  
  // Navigation
  ResponsiveSidebar, TopBar, Breadcrumbs, MegaMenu,
  
  // Data
  DataTable, TableActions,
  
  // Interactive
  ResponsiveModal, Drawer, NotificationToast, AlertBanner,
  
  // Project
  TaskList, ProjectCard, CalendarWidget, ActivityLog, StatusBadge,
  
  // Media
  ImageGallery, Carousel, VideoEmbed, VideoIframe
} from '../components/ui/ResponsiveDashboardKit';
```

## 🎯 Most Common Patterns

### Dashboard with KPIs
```jsx
<GridContainer>
  <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md">
    <KPICard title="Revenue" value={125000} format="currency" icon={DollarSign} change={12.5} trend="up" />
    <KPICard title="Users" value={1284} format="number" icon={Users} />
    <KPICard title="Rate" value={8.4} format="percentage" icon={Activity} />
  </ResponsiveGrid>
</GridContainer>
```

### Data Table with Mobile Cards
```jsx
const columns = [
  { accessor: 'name', label: 'Name', sortable: true },
  { accessor: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> }
];

<DataTable
  columns={columns}
  data={data}
  searchable
  pagination
  mobileCardView
  actions={(row) => <TableActions onView={...} onEdit={...} onDelete={...} />}
/>
```

### Modal with Form
```jsx
<ResponsiveModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit Item"
  size="lg"
  footer={
    <>
      <Button variant="outline" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </>
  }
>
  <FormContent />
</ResponsiveModal>
```

### Project Cards Grid
```jsx
<ResponsiveGrid cols={{ xs: 1, md: 2, lg: 3 }} gap="md">
  {projects.map(project => (
    <ProjectCard
      key={project.id}
      project={project}
      onView={() => navigate(`/projects/${project.id}`)}
    />
  ))}
</ResponsiveGrid>
```

### Image Gallery
```jsx
<ImageGallery
  images={[
    { url: '/img1.jpg', title: 'Dashboard' },
    { url: '/img2.jpg', title: 'Analytics' }
  ]}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
/>
```

## 📏 Responsive Breakpoints

```
xs:  0px    → Mobile
sm:  640px  → Tablet Portrait
md:  768px  → Tablet Landscape
lg:  1024px → Desktop
xl:  1280px → Large Desktop
2xl: 1536px → 4K
```

## 🎨 Component Sizes

Most components support: `sm`, `md`, `lg`, `xl`

```jsx
<ProgressRing size="md" />
<Button size="lg" />
<StatusBadge size="sm" />
```

## 🎭 Status Types

```jsx
<StatusBadge status="active" />    // green
<StatusBadge status="pending" />   // yellow
<StatusBadge status="completed" /> // blue
<StatusBadge status="error" />     // red
<StatusBadge status="inactive" />  // gray
```

## 🔔 Notification Types

```jsx
<NotificationToast type="success" title="Saved!" />
<NotificationToast type="error" title="Error" />
<NotificationToast type="warning" title="Warning" />
<NotificationToast type="info" title="Info" />
```

## 📊 Format Types

```jsx
<KPICard format="currency" value={125000} />   // $125,000
<KPICard format="percentage" value={8.4} />    // 8.4%
<KPICard format="number" value={1284} />       // 1,284
```

## 🎨 Color Themes

```jsx
<ProgressRing color="blue" />
<ProgressRing color="green" />
<ProgressRing color="purple" />
<ProgressRing color="red" />
<ProgressRing color="yellow" />
```

## 🚪 Modal Sizes

```jsx
<ResponsiveModal size="sm" />   // 384px max width
<ResponsiveModal size="md" />   // 448px (default)
<ResponsiveModal size="lg" />   // 672px
<ResponsiveModal size="xl" />   // 896px
<ResponsiveModal size="full" /> // 1536px
```

## 📍 Drawer Positions

```jsx
<Drawer position="right" />  // slide from right (default)
<Drawer position="left" />   // slide from left
<Drawer position="top" />    // slide from top
<Drawer position="bottom" /> // slide from bottom
```

## 🎯 Quick Tips

1. **Always wrap in GridContainer** for consistent spacing
2. **Use ResponsiveGrid** for automatic responsive layouts
3. **Enable mobileCardView** on DataTable for mobile
4. **Test breakpoints**: xs → sm → md → lg → xl
5. **Use StatusBadge** for consistent status display
6. **Prefer size="md"** for most components
7. **Include loading states** for async data

## 🔥 Hot Keys (Gallery/Carousel)

- `←` `→` Navigate images
- `Esc` Close lightbox
- Swipe on mobile

## 🌙 Dark Mode

All components automatically support dark mode via Tailwind's `dark:` prefix. No configuration needed!

## ♿ Accessibility

All components include:
- Keyboard navigation (Tab, Enter, Esc)
- ARIA labels
- Focus indicators
- Screen reader support

## 📚 Full Docs

See `/docs/RESPONSIVE_UI_KIT_GUIDE.md` for complete API reference.

## 🎬 Demo Page

Visit: `http://localhost:3004/dashboard-enhanced`

Or: `https://psychic-adventure-pj4qxj6qx5v4f66w5-3004.app.github.dev/dashboard-enhanced`

---

**Need Help?** Check the component files for inline JSDoc comments!
