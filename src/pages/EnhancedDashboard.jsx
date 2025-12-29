// Enhanced Dashboard Page - Showcases New Responsive UI Kit
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import {
  Activity,
  Users,
  Mail,
  Calendar,
  Sparkles,
  Clock,
  Rocket,
  DollarSign,
  TrendingDown,
  Eye,
  Download,
} from 'lucide-react';

// Import new responsive components
import {
  GridContainer,
  GridRow,
  GridCol,
  ResponsiveGrid,
  KPICard,
  StatsWidget,
  ProgressRing,
  Gauge,
  MetricCard,
  TopBar,
  DataTable,
  TableActions,
  ResponsiveModal,
  ProjectCard,
  CalendarWidget,
  ActivityLog,
  StatusBadge,
  Carousel,
} from '../components/ui/ResponsiveDashboardKit';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  // Sample data for tables
  const tableColumns = [
    { accessor: 'name', label: 'Campaign Name', sortable: true },
    { accessor: 'status', label: 'Status', render: val => <StatusBadge status={val} size="sm" /> },
    { accessor: 'leads', label: 'Leads', sortable: true },
    { accessor: 'sent', label: 'Sent', sortable: true },
    { accessor: 'replies', label: 'Replies', sortable: true },
    { accessor: 'rate', label: 'Rate', render: val => `${val}%` },
  ];

  const tableData = [
    { name: 'Q4 SaaS Outreach', status: 'active', leads: 450, sent: 320, replies: 28, rate: 8.8 },
    {
      name: 'Enterprise Follow-up',
      status: 'active',
      leads: 180,
      sent: 156,
      replies: 15,
      rate: 9.6,
    },
    { name: 'Product Launch', status: 'pending', leads: 290, sent: 180, replies: 12, rate: 6.7 },
    {
      name: 'Holiday Campaign',
      status: 'completed',
      leads: 550,
      sent: 550,
      replies: 44,
      rate: 8.0,
    },
  ];

  // Sample project data
  const projects = [
    {
      name: 'Enterprise Sales Campaign',
      category: 'B2B Sales',
      description: 'Target Fortune 500 companies with personalized outreach',
      totalTasks: 25,
      completedTasks: 18,
      members: 5,
      dueDate: 'Dec 31',
      priority: 'high',
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Product Launch Sequence',
      category: 'Marketing',
      description: 'Multi-channel campaign for new product release',
      totalTasks: 18,
      completedTasks: 12,
      members: 3,
      dueDate: 'Jan 15',
      priority: 'medium',
      color: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      name: 'Customer Retention',
      category: 'Customer Success',
      description: 'Re-engagement campaign for inactive customers',
      totalTasks: 12,
      completedTasks: 8,
      members: 2,
      dueDate: 'Jan 30',
      priority: 'low',
      color: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
  ];

  // Sample activities
  const activities = [
    {
      title: 'New lead replied',
      description: 'Sarah Chen from TechCorp responded to your email',
      time: '2 minutes ago',
      icon: Mail,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Meeting booked',
      description: 'Michael Torres scheduled a demo for tomorrow',
      time: '15 minutes ago',
      icon: Calendar,
      color: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Campaign launched',
      description: 'Enterprise Follow-up campaign is now active',
      time: '1 hour ago',
      icon: Rocket,
      color: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  // Sample calendar events
  const calendarEvents = [
    { title: 'Product Demo', date: '2025-12-28', color: 'bg-blue-600' },
    { title: 'Team Sync', date: '2025-12-29', color: 'bg-green-600' },
    { title: 'Campaign Review', date: '2025-12-30', color: 'bg-purple-600' },
  ];

  // Carousel items
  const carouselItems = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      title: 'Analytics Dashboard',
      description: 'Track your campaign performance in real-time',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      title: 'AI-Powered Insights',
      description: 'Get smart recommendations from Ava',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
      title: 'Team Collaboration',
      description: 'Work together seamlessly',
    },
  ];

  return (
    <DashboardLayout>
      {/* Top Bar with Breadcrumbs */}
      <TopBar
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your campaigns."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }]}
        actions={[
          <button
            key="new-campaign"
            onClick={() => navigate('/campaigns')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Rocket size={16} />
            <span className="hidden sm:inline">New Campaign</span>
          </button>,
        ]}
      />

      <GridContainer className="py-6">
        {/* KPI Cards - Fully Responsive */}
        <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap="md" className="mb-8">
          <KPICard
            title="Total Revenue"
            value={245680}
            change={12.5}
            trend="up"
            format="currency"
            icon={DollarSign}
          />
          <KPICard
            title="Active Leads"
            value={1284}
            change={8.3}
            trend="up"
            format="number"
            icon={Users}
          />
          <KPICard
            title="Reply Rate"
            value={8.4}
            change={-2.1}
            trend="down"
            format="percentage"
            icon={Activity}
          />
          <KPICard
            title="Meetings Booked"
            value={47}
            change={15.2}
            trend="up"
            format="number"
            icon={Calendar}
          />
        </ResponsiveGrid>

        {/* Stats Widget */}
        <div className="mb-8">
          <StatsWidget
            title="This Week's Performance"
            stats={[
              { label: 'Emails Sent', value: '2,543', subtext: '+12% from last week' },
              { label: 'Open Rate', value: '34.2%', subtext: 'Above average' },
              { label: 'Click Rate', value: '12.8%', subtext: 'Excellent' },
              { label: 'Conversions', value: '89', subtext: '6.4% conversion rate' },
            ]}
          />
        </div>

        {/* Main Content Grid */}
        <GridRow gap="lg" className="mb-8">
          {/* Progress Rings */}
          <GridCol xs={12} md={6} lg={4}>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Campaign Progress
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-around">
                <ProgressRing value={75} label="Completion" size="md" color="blue" />
                <ProgressRing value={88} label="Engagement" size="md" color="green" />
              </div>
            </div>
          </GridCol>

          {/* Gauge */}
          <GridCol xs={12} md={6} lg={4}>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Score
              </h3>
              <div className="flex justify-center">
                <Gauge value={84} min={0} max={100} label="Overall Health" size="md" />
              </div>
            </div>
          </GridCol>

          {/* Calendar Widget */}
          <GridCol xs={12} lg={4}>
            <CalendarWidget events={calendarEvents} />
          </GridCol>
        </GridRow>

        {/* Data Table - Responsive with Mobile Card View */}
        <div className="mb-8">
          <DataTable
            columns={tableColumns}
            data={tableData}
            searchable
            exportable
            pagination
            pageSize={5}
            mobileCardView
            onRowClick={row => toast.info(`Clicked: ${row.name}`)}
            actions={row => (
              <TableActions
                onView={() => toast.info(`Viewing ${row.name}`)}
                onEdit={() => toast.info(`Editing ${row.name}`)}
                onDelete={() => toast.error(`Delete ${row.name}?`)}
              />
            )}
          />
        </div>

        {/* Project Cards Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Projects</h2>
          <ResponsiveGrid cols={{ xs: 1, md: 2, lg: 3 }} gap="md">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                onView={() => toast.info(`Viewing ${project.name}`)}
              />
            ))}
          </ResponsiveGrid>
        </div>

        {/* Two Column Layout */}
        <GridRow gap="lg" className="mb-8">
          {/* Activity Log */}
          <GridCol xs={12} lg={6}>
            <ActivityLog activities={activities} />
          </GridCol>

          {/* Metric Cards */}
          <GridCol xs={12} lg={6}>
            <ResponsiveGrid cols={{ xs: 1, sm: 2 }} gap="md">
              <MetricCard label="Page Views" value="24.5K" change="+12.5%" trend="up" icon={Eye} />
              <MetricCard
                label="Downloads"
                value="3,247"
                change="+8.2%"
                trend="up"
                icon={Download}
              />
              <MetricCard
                label="Bounce Rate"
                value="32.4%"
                change="-5.1%"
                trend="up"
                icon={TrendingDown}
              />
              <MetricCard
                label="Avg. Session"
                value="4m 28s"
                change="+18%"
                trend="up"
                icon={Clock}
              />
            </ResponsiveGrid>
          </GridCol>
        </GridRow>

        {/* Carousel */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Platform Features
          </h2>
          <Carousel items={carouselItems} autoPlay interval={5000} />
        </div>

        {/* Call to Action */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Ready to Scale Your Outreach?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Launch your next campaign with AI-powered automation and watch your conversion rates
            soar.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            <Sparkles size={20} />
            Get Started with AI
          </button>
        </div>
      </GridContainer>

      {/* Demo Modal */}
      <ResponsiveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Welcome to AI-Powered Campaigns"
        description="Let Ava help you create high-converting campaigns in minutes."
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                setModalOpen(false);
                navigate('/ava');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto"
            >
              Start with Ava
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">Ava can help you:</p>
          <ul className="space-y-2">
            {[
              'Generate personalized email sequences',
              'Optimize send times for maximum engagement',
              'Score and prioritize leads automatically',
              'Provide real-time campaign insights',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </ResponsiveModal>
    </DashboardLayout>
  );
};

export default EnhancedDashboard;
