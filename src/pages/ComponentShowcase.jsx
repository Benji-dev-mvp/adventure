import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Textarea,
  Checkbox, 
  Radio, 
  RadioGroup,
  Switch,
  Select,
  Alert,
  Badge,
  Avatar,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Spinner,
  LoadingDots,
  LoadingBar,
  EmptyState,
  Stat,
  StatGroup,
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  Tabs
} from '@/components/ui';
import { useToast } from '@/components/Toast';

const ComponentShowcase = () => {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(45);
  const [switchChecked, setSwitchChecked] = useState(false);

  const handleToast = (type) => {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'An error occurred. Please try again.',
      warning: 'This action requires confirmation.',
      info: 'Here\'s some helpful information.',
    };
    toast[type](messages[type]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Artisan Design System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A comprehensive component library built with Tailwind CSS, Radix UI, and React
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="success">Production Ready</Badge>
            <Badge variant="info">Accessible</Badge>
            <Badge variant="purple">Dark Mode</Badge>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Navigation</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Breadcrumb</h3>
                <Breadcrumb>
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/components">Components</BreadcrumbItem>
                  <BreadcrumbItem active>Showcase</BreadcrumbItem>
                </Breadcrumb>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pagination</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Card>

        {/* Form Components */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Form Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="you@example.com"
                helperText="We'll never share your email"
                required
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                error="Password must be at least 8 characters"
              />
              <Textarea 
                label="Description" 
                placeholder="Enter description..."
                rows={4}
              />
              <div className="space-y-4">
                <Checkbox label="Accept terms and conditions" />
                <Checkbox label="Subscribe to newsletter" />
                <Switch 
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  label="Enable notifications"
                />
              </div>
              <RadioGroup label="Select a plan">
                <Radio name="plan" label="Free - $0/month" value="free" />
                <Radio name="plan" label="Pro - $29/month" value="pro" />
                <Radio name="plan" label="Enterprise - $99/month" value="enterprise" />
              </RadioGroup>
            </div>
          </div>
        </Card>

        {/* Alerts & Feedback */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Alerts & Feedback</h2>
            <div className="space-y-4">
              <Alert variant="info" title="Information">
                This is an informational message with helpful details.
              </Alert>
              <Alert variant="success" title="Success!">
                Your changes have been saved successfully.
              </Alert>
              <Alert variant="warning" title="Warning">
                This action cannot be undone. Please proceed with caution.
              </Alert>
              <Alert variant="error" title="Error" onClose={() => console.log('Closed')}>
                An error occurred while processing your request.
              </Alert>
            </div>

            <div className="mt-6 space-x-3">
              <Button onClick={() => handleToast('success')}>Show Success</Button>
              <Button onClick={() => handleToast('error')}>Show Error</Button>
              <Button onClick={() => handleToast('warning')}>Show Warning</Button>
              <Button onClick={() => handleToast('info')}>Show Info</Button>
            </div>
          </div>
        </Card>

        {/* Loading States */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Loading States</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Spinner size="xs" />
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
              <LoadingDots />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Upload Progress</span>
                  <span>{loadingProgress}%</span>
                </div>
                <LoadingBar progress={loadingProgress} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setLoadingProgress(Math.min(100, loadingProgress + 10))}>
                    Increase
                  </Button>
                  <Button size="sm" onClick={() => setLoadingProgress(Math.max(0, loadingProgress - 10))}>
                    Decrease
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Statistics</h2>
            <StatGroup>
              <Stat
                label="Total Revenue"
                value="$45,231"
                change="+20.1%"
                trend="up"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <Stat
                label="Active Users"
                value="2,350"
                change="+180"
                trend="up"
                variant="success"
              />
              <Stat
                label="Conversion Rate"
                value="3.65%"
                change="-0.5%"
                trend="down"
                variant="warning"
              />
              <Stat
                label="Avg. Response Time"
                value="1.2s"
                change="+0.3s"
                trend="down"
              />
            </StatGroup>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Table</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow clickable>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow clickable>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow clickable>
                  <TableCell className="font-medium">Bob Johnson</TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>
                    <Badge variant="gray">Inactive</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Accordion */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Accordion</h2>
            <Accordion type="single" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger value="item-1">
                  What is Artisan?
                </AccordionTrigger>
                <AccordionContent value="item-1">
                  Artisan is an enterprise AI-powered B2B sales automation platform that helps teams automate their outbound campaigns across multiple channels.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger value="item-2">
                  How does multi-channel automation work?
                </AccordionTrigger>
                <AccordionContent value="item-2">
                  Our platform integrates with email, LinkedIn, SMS, and phone systems to create coordinated campaigns that reach prospects through their preferred channels.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger value="item-3">
                  Is it accessible?
                </AccordionTrigger>
                <AccordionContent value="item-3">
                  Yes! All components are built with accessibility in mind, following WCAG 2.1 AA guidelines with proper ARIA attributes and keyboard navigation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>

        {/* Badges & Avatars */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Badges & Avatars</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="gray">Gray</Badge>
                  <Badge variant="purple">Purple</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Avatars</h3>
                <div className="flex items-center gap-3">
                  <Avatar size="sm" name="John Doe" />
                  <Avatar size="md" name="Jane Smith" />
                  <Avatar size="lg" name="Bob Johnson" />
                  <Avatar size="xl" name="Alice Williams" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tooltips */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Tooltips</h2>
            <div className="flex gap-4">
              <Tooltip content="This appears on top" position="top">
                <Button>Hover Top</Button>
              </Tooltip>
              <Tooltip content="This appears on bottom" position="bottom">
                <Button>Hover Bottom</Button>
              </Tooltip>
              <Tooltip content="This appears on left" position="left">
                <Button>Hover Left</Button>
              </Tooltip>
              <Tooltip content="This appears on right" position="right">
                <Button>Hover Right</Button>
              </Tooltip>
            </div>
          </div>
        </Card>

        {/* Drawer */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Drawer</h2>
            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <DrawerHeader>
                <DrawerTitle>Drawer Title</DrawerTitle>
                <DrawerClose />
              </DrawerHeader>
              <DrawerContent>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    This is a drawer component that slides in from the side. It's perfect for navigation menus, settings panels, or any content that needs to overlay the main page.
                  </p>
                  <Input label="Name" placeholder="Enter your name" />
                  <Input label="Email" type="email" placeholder="Enter your email" />
                  <Textarea label="Message" placeholder="Enter your message" rows={4} />
                </div>
              </DrawerContent>
              <DrawerFooter>
                <Button variant="primary">Save Changes</Button>
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              </DrawerFooter>
            </Drawer>
          </div>
        </Card>

        {/* Empty State */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Empty State</h2>
            <EmptyState
              title="No items found"
              description="Get started by creating your first item. It only takes a few seconds."
              action={<Button>Create New Item</Button>}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComponentShowcase;
