/**
 * Comprehensive Responsive Dashboard UI Kit
 * 100% responsive across all devices (mobile, tablet, desktop)
 * 
 * @exports Layout System - GridSystem, FlexContainer, ResponsiveStack, Section
 * @exports Dashboard Widgets - KPICard, StatsWidget, ProgressRing, Gauge, MetricCard
 * @exports Navigation - ResponsiveSidebar, Breadcrumbs, TopBar, MegaMenu, CollapsibleMenu
 * @exports Data Display - DataTable, TableActions
 * @exports Interactive - ResponsiveModal, Drawer, NotificationToast, AlertBanner, NotificationCenter
 * @exports Project Management - TaskList, ProjectCard, CalendarWidget, ActivityLog, StatusBadge
 * @exports Media - ImageGallery, Carousel, VideoEmbed, VideoIframe
 */

// Layout System
export {
  GridContainer,
  GridRow,
  GridCol,
  FlexContainer,
  ResponsiveStack,
  ResponsiveGrid,
  Section,
  ShowAt,
  HideAt,
  Spacer
} from './GridSystem';

// Dashboard Widgets
export {
  KPICard,
  StatsWidget,
  ProgressRing,
  Gauge,
  MetricCard,
  ActivityTimeline
} from './DashboardWidgets';

// Navigation Components
export {
  ResponsiveSidebar,
  Breadcrumbs,
  TopBar,
  MegaMenu,
  CollapsibleMenu
} from './NavigationComponents';

// Data Display
export {
  DataTable,
  TableActions
} from './DataTableResponsive';

// Interactive Components
export {
  ResponsiveModal,
  Drawer,
  NotificationToast,
  AlertBanner,
  NotificationCenter
} from './InteractiveComponents';

// Project Management Widgets
export {
  TaskList,
  ProjectCard,
  CalendarWidget,
  ActivityLog,
  StatusBadge
} from './ProjectWidgets';

// Media Components
export {
  ImageGallery,
  Carousel,
  VideoEmbed,
  VideoIframe
} from './MediaComponents';

// Re-export existing UI components for convenience
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { Button } from './Button';
export { Badge } from './Badge';
export { Input } from './Input';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { Select } from './Select';
export { Checkbox } from './Checkbox';
export { Radio } from './Radio';
export { Switch } from './switch';
export { Progress } from './Progress';
export { Spinner } from './Spinner';
export { Avatar } from './Avatar';
export { Tooltip } from './Tooltip';
export { Dialog } from './Dialog';
export { Modal } from './Modal';
export { Alert } from './Alert';
export { EmptyState } from './EmptyState';
export { Stat } from './Stat';
export { Pagination } from './Pagination';

/**
 * Usage Examples:
 * 
 * // Layout
 * <GridContainer>
 *   <GridRow gap="md">
 *     <GridCol xs={12} md={6} lg={4}>Content</GridCol>
 *   </GridRow>
 * </GridContainer>
 * 
 * // KPI Dashboard
 * <KPICard
 *   title="Revenue"
 *   value={125000}
 *   change={12.5}
 *   trend="up"
 *   format="currency"
 *   icon={DollarSign}
 * />
 * 
 * // Data Table with Mobile View
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   searchable
 *   pagination
 *   mobileCardView
 * />
 * 
 * // Responsive Modal
 * <ResponsiveModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Edit Item"
 *   size="lg"
 * >
 *   <Form />
 * </ResponsiveModal>
 * 
 * // Project Cards Grid
 * <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 3 }}>
 *   {projects.map(project => (
 *     <ProjectCard key={project.id} project={project} />
 *   ))}
 * </ResponsiveGrid>
 */
