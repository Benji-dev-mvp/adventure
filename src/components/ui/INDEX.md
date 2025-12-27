# 📚 Artisan Component Library - Documentation Index

Welcome to the Artisan Component Library! This index helps you navigate all available documentation.

## 🚀 Getting Started

1. **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
   - Essential components
   - Common patterns
   - Pro tips

2. **[Component Catalog](./CATALOG.md)** - Quick reference for all components
   - Import paths
   - Basic usage
   - Prop patterns

## 📖 Core Documentation

3. **[README](./README.md)** - Main component library overview
   - Features & benefits
   - Tech stack
   - Installation
   - Usage examples
   - Performance metrics

4. **[Design System](./DESIGN_SYSTEM.md)** - Design principles & tokens
   - Color palette
   - Typography scale
   - Spacing system
   - Accessibility guidelines
   - Dark mode implementation

5. **[Component Guide](./COMPONENT_GUIDE.md)** - Complete API reference
   - All components with props
   - Code examples
   - Best practices
   - Testing patterns

## 📦 Additional Resources

6. **[Build Summary](../../../COMPONENT_LIBRARY_SUMMARY.md)** - Project overview
   - What was built
   - Success metrics
   - Next steps

7. **[Package Manifest](./package.json)** - npm package configuration
   - Dependencies
   - Exports
   - Metadata

## 🎨 Live Demo

8. **Component Showcase** - Visit `/component-showcase` in your browser
   - Interactive examples
   - Live code demos
   - Dark mode toggle
   - Responsive preview

## 📂 Component Files

All component source files are in this directory:
```
src/components/ui/
├── Form Components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Textarea.jsx
│   ├── Select.jsx
│   ├── Checkbox.jsx
│   ├── Radio.jsx
│   └── Switch.jsx
├── Data Display
│   ├── Table.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Avatar.jsx
│   ├── Stat.jsx
│   └── EmptyState.jsx
├── Feedback
│   ├── Alert.jsx
│   ├── Spinner.jsx
│   ├── Progress.jsx
│   ├── Skeleton.jsx
│   └── Toast.jsx
├── Navigation
│   ├── Breadcrumb.jsx
│   ├── Pagination.jsx
│   └── Tabs.jsx
├── Overlays
│   ├── Dialog.jsx
│   ├── Modal.jsx
│   ├── Drawer.jsx
│   ├── Tooltip.jsx
│   └── Popover.jsx
└── Interactive
    ├── Accordion.jsx
    ├── AnimatedButton.jsx
    └── Command.jsx
```

## 🔍 Quick Links by Task

### I want to...

**Build a form**
- Start with [Quick Start Guide](./QUICK_START.md#forms)
- See [Component Guide - Forms](./COMPONENT_GUIDE.md#form-inputs)
- Check [Input](./Input.jsx), [Button](./Button.jsx), [Checkbox](./Checkbox.jsx)

**Display data**
- Check [Table](./COMPONENT_GUIDE.md#tables)
- Use [Stat](./COMPONENT_GUIDE.md#statistics) for metrics
- Try [Card](./COMPONENT_GUIDE.md#cards) for containers

**Show feedback**
- Use [Toast](./COMPONENT_GUIDE.md#toast-notifications) for notifications
- Try [Alert](./COMPONENT_GUIDE.md#alerts) for inline messages
- Add [Spinner](./COMPONENT_GUIDE.md#loading-states) for loading

**Create navigation**
- Check [Breadcrumb](./COMPONENT_GUIDE.md#navigation)
- Use [Pagination](./COMPONENT_GUIDE.md#navigation)
- Try [Tabs](./COMPONENT_GUIDE.md#navigation)

**Add overlays**
- Use [Drawer](./COMPONENT_GUIDE.md#drawer) for side panels
- Try [Modal](./COMPONENT_GUIDE.md#modal--dialog) for dialogs
- Add [Tooltip](./COMPONENT_GUIDE.md#tooltips) for hints

**Understand styling**
- Read [Design System](./DESIGN_SYSTEM.md)
- Check [Color System](./DESIGN_SYSTEM.md#color-system)
- Learn [Dark Mode](./DESIGN_SYSTEM.md#dark-mode)

**See examples**
- Visit `/component-showcase` in browser
- Check [Quick Start Examples](./QUICK_START.md#common-patterns)
- Review [Component Guide Examples](./COMPONENT_GUIDE.md#usage-examples)

## 📋 Cheat Sheet

### Common Imports
```jsx
// Forms
import { Button, Input, Checkbox, Radio } from '@/components/ui';

// Data Display
import { Table, Card, Badge, Avatar, Stat } from '@/components/ui';

// Feedback
import { Alert, Spinner, Progress } from '@/components/ui';
import { useToast } from '@/components/Toast';

// Navigation
import { Breadcrumb, Pagination, Tabs } from '@/components/ui';

// Overlays
import { Drawer, Modal, Tooltip } from '@/components/ui';
```

### Common Patterns
```jsx
// Toast notification
const toast = useToast();
toast.success('Saved!');

// Dark mode toggle
const { theme, toggleTheme } = useTheme();

// Conditional styling
import { cn } from '@/lib/utils';
<div className={cn("base", isActive && "active")} />
```

## 🆘 Getting Help

### Documentation Order for Beginners
1. Start with [Quick Start Guide](./QUICK_START.md) - 5 min read
2. Browse [Component Catalog](./CATALOG.md) - 2 min scan
3. Visit `/component-showcase` - Interactive learning
4. Deep dive [Component Guide](./COMPONENT_GUIDE.md) - Reference as needed
5. Understand [Design System](./DESIGN_SYSTEM.md) - For customization

### Documentation Order for Advanced Users
1. Check [Component Catalog](./CATALOG.md) - Quick lookup
2. Reference [Component Guide](./COMPONENT_GUIDE.md) - API details
3. Review [Design System](./DESIGN_SYSTEM.md) - For custom styling
4. Read [README](./README.md) - For architecture decisions

### Still Need Help?
- 📧 Email: support@artisan.com
- 💬 GitHub Issues: Report bugs or request features
- 📚 Check `/component-showcase` for live examples

## 📊 Documentation Stats

- **Total Components**: 40+
- **Documentation Files**: 7
- **Code Examples**: 100+
- **Live Demo Routes**: 1

## 🎯 Quick Access

| Document | Purpose | Read Time | Audience |
|----------|---------|-----------|----------|
| [Quick Start](./QUICK_START.md) | Get started fast | 5 min | Beginners |
| [Catalog](./CATALOG.md) | Component lookup | 2 min | Everyone |
| [README](./README.md) | Overview | 10 min | Everyone |
| [Design System](./DESIGN_SYSTEM.md) | Styling guide | 15 min | Designers/Devs |
| [Component Guide](./COMPONENT_GUIDE.md) | API reference | 30+ min | Developers |
| [Build Summary](../../../COMPONENT_LIBRARY_SUMMARY.md) | Project details | 10 min | Team Leads |

## 🔄 Updates

**Version 1.0.0** (December 2025)
- Initial release
- 40+ components
- Full documentation
- Live showcase

## 📝 Contributing

Want to add a component or improve docs?
1. Follow existing patterns
2. Update relevant documentation
3. Add to ComponentShowcase page
4. Add tests

---

**Happy building with Artisan Components! 🚀**

*For the latest updates, visit the [Component Showcase](/component-showcase)*
