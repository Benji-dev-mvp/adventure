import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../contexts/ThemeContext';
import { useTenant } from '../contexts/TenantContext';
import { getUserPreferences, saveUserPreferences } from '../lib/storage';
import { cn } from '../lib/utils';
import { SegmentSwitcher } from '../components/SegmentSwitcher';
import {
  Mail,
  Shield,
  Users,
  CreditCard,
  Bell,
  Zap,
  Globe,
  Key,
  CheckCircle2,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Layout,
  PanelLeft,
  PanelTop,
} from 'lucide-react';
import {
  EmailWarmup,
  DomainSetup,
  TwoFactorAuth,
  RateLimiting,
} from '../components/settings/SettingsComponents';

/**
 * Navigation Layout Settings Component
 */
function NavigationLayoutSettings() {
  const { navigationLayout, setNavigationLayout } = useTenant();

  const layouts = [
    {
      id: 'sidebar-only',
      label: 'Sidebar Only',
      description: 'Clean, focused layout with sidebar navigation',
      icon: PanelLeft,
    },
    {
      id: 'sidebar-top',
      label: 'Sidebar + Top Bar',
      description: 'Additional top navigation for quick access',
      icon: Layout,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation Layout</CardTitle>
        <CardDescription>Choose how navigation appears in the app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {layouts.map(layout => {
            const Icon = layout.icon;
            const isSelected = navigationLayout === layout.id;

            return (
              <button
                key={layout.id}
                onClick={() => setNavigationLayout(layout.id)}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      isSelected
                        ? 'bg-accent-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        'font-semibold',
                        isSelected
                          ? 'text-accent-700 dark:text-accent-300'
                          : 'text-gray-900 dark:text-white'
                      )}
                    >
                      {layout.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {layout.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 size={12} />
                      Active
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const initialPrefs = getUserPreferences();
  const [emailPrefs, setEmailPrefs] = useState(
    initialPrefs.emailNotifications || {
      campaignPerformanceReports: true,
      newLeads: true,
      meetingBookings: true,
      replies: false,
      aiInsights: false,
    }
  );

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'email', label: 'Email & Sending', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="grid lg:grid-cols-4 gap-4">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-1">
              <nav className="space-y-0.5">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                        activeTab === tab.id
                          ? isDark
                            ? 'bg-slate-900/70 text-white border-white/15 shadow-sm'
                            : 'bg-white text-accent-600 border-gray-200 shadow-sm'
                          : isDark
                            ? 'text-gray-200 border-transparent hover:bg-white/5 hover:border-white/10'
                            : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
                      )}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Appearance */}
          {activeTab === 'appearance' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>Choose your preferred color scheme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Light Mode */}
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`relative p-6 rounded-xl border-2 transition-all ${
                          theme === 'light'
                            ? 'border-accent-500 bg-accent-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <Sun size={32} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Light Mode</p>
                            <p className="text-sm text-gray-500">Bright and clear</p>
                          </div>
                          {theme === 'light' && (
                            <Badge variant="success" className="absolute top-3 right-3 gap-1">
                              <CheckCircle2 size={12} />
                              Active
                            </Badge>
                          )}
                        </div>
                      </button>

                      {/* Dark Mode */}
                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`relative p-6 rounded-xl border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-accent-500 bg-accent-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                            <Moon size={32} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Dark Mode</p>
                            <p className="text-sm text-gray-500">Easy on the eyes</p>
                          </div>
                          {theme === 'dark' && (
                            <Badge variant="success" className="absolute top-3 right-3 gap-1">
                              <CheckCircle2 size={12} />
                              Active
                            </Badge>
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-0.5">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-blue-900 mb-1">Theme Preference</p>
                          <p className="text-sm text-blue-700">
                            Your theme preference is saved automatically and will be applied across
                            all pages.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>Customize your viewing experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-medium text-gray-900">Compact View</p>
                        <p className="text-sm text-gray-500">Show more content on screen</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-medium text-gray-900">Animations</p>
                        <p className="text-sm text-gray-500">
                          Enable smooth transitions and effects
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Layout */}
              <NavigationLayoutSettings />

              {/* Demo Segment Switcher */}
              <Card>
                <CardHeader>
                  <CardTitle>Demo Organization</CardTitle>
                  <CardDescription>
                    Switch between segments to preview different features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SegmentSwitcher />
                </CardContent>
              </Card>
            </>
          )}

          {/* Email & Sending */}
          {activeTab === 'email' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Connected Email Accounts</CardTitle>
                  <CardDescription>Manage your sending email addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">alex@company.com</p>
                          <p className="text-sm text-gray-500">Gmail • Primary</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 size={12} />
                          Connected
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      + Add Email Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* New Advanced Components */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EmailWarmup />
                <DomainSetup />
              </div>
              <RateLimiting />

              <Card>
                <CardHeader>
                  <CardTitle>Domain Warmup & Deliverability</CardTitle>
                  <CardDescription>Optimize email deliverability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="text-green-600" size={20} />
                          <span className="font-semibold text-gray-900">
                            Domain Health: Excellent
                          </span>
                        </div>
                        <Badge variant="success">92/100</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">SPF</p>
                          <p className="font-semibold text-green-600">✓ Verified</p>
                        </div>
                        <div>
                          <p className="text-gray-600">DKIM</p>
                          <p className="font-semibold text-green-600">✓ Verified</p>
                        </div>
                        <div>
                          <p className="text-gray-600">DMARC</p>
                          <p className="font-semibold text-green-600">✓ Verified</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Warmup</p>
                          <p className="text-sm text-gray-500">Gradually increase sending volume</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Spam Filter Testing</p>
                          <p className="text-sm text-gray-500">Check emails before sending</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <Input label="Daily Send Limit" type="number" defaultValue="150" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sending Schedule</CardTitle>
                  <CardDescription>When should Ava send emails?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Send during business hours only
                      </span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Time" type="time" defaultValue="09:00" />
                      <Input label="End Time" type="time" defaultValue="17:00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500">
                        <option>Pacific Time (PT)</option>
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>CRM Integrations</CardTitle>
                  <CardDescription>Sync leads and track activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Salesforce', status: 'connected', logo: '☁️' },
                      { name: 'HubSpot', status: 'not-connected', logo: '🟠' },
                      { name: 'Pipedrive', status: 'not-connected', logo: '🟢' },
                    ].map(integration => (
                      <div
                        key={integration.name}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.logo}</span>
                          <span className="font-medium text-gray-900">{integration.name}</span>
                        </div>
                        {integration.status === 'connected' ? (
                          <div className="flex items-center gap-3">
                            <Badge variant="success">Connected</Badge>
                            <Button variant="ghost" size="sm">
                              Configure
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>LinkedIn Integration</CardTitle>
                  <CardDescription>Enable LinkedIn outreach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-semibold">
                          in
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">LinkedIn Sales Navigator</p>
                          <p className="text-sm text-gray-500">Multi-channel outreach</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Receive real-time updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Input label="Webhook URL" placeholder="https://your-domain.com/webhook" />
                    <Button variant="outline" size="sm">
                      Test Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Team */}
          {activeTab === 'team' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Manage who can access your account</CardDescription>
                    </div>
                    <Button>+ Invite Member</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: 'Alex Johnson',
                        email: 'alex@company.com',
                        role: 'Owner',
                        avatar: '👤',
                      },
                      {
                        name: 'Sarah Chen',
                        email: 'sarah@company.com',
                        role: 'Admin',
                        avatar: '👩',
                      },
                      {
                        name: 'Michael Park',
                        email: 'michael@company.com',
                        role: 'Member',
                        avatar: '👨',
                      },
                    ].map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge>{member.role}</Badge>
                          {member.role !== 'Owner' && (
                            <Button variant="ghost" size="sm">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Configure what team members can do</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { role: 'Admin', description: 'Full access to all features' },
                      { role: 'Member', description: 'Can manage campaigns and leads' },
                      { role: 'Viewer', description: 'Read-only access' },
                    ].map((roleType, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{roleType.role}</p>
                            <p className="text-sm text-gray-500">{roleType.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Professional Plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          $299<span className="text-lg text-gray-600">/month</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Billed monthly • Next billing: Jan 26, 2026
                        </p>
                      </div>
                      <Badge variant="accent">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Emails this month</p>
                        <p className="text-xl font-semibold text-gray-900">12,453 / 50,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Leads</p>
                        <p className="text-xl font-semibold text-gray-900">1,284 / 10,000</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="ghost">Cancel Subscription</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-gray-400" size={24} />
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Download past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { date: 'Dec 26, 2025', amount: '$299.00', status: 'Paid' },
                      { date: 'Nov 26, 2025', amount: '$299.00', status: 'Paid' },
                      { date: 'Oct 26, 2025', amount: '$299.00', status: 'Paid' },
                    ].map((invoice, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{invoice.date}</p>
                          <p className="text-sm text-gray-500">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">{invoice.status}</Badge>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              {/* New Advanced Component */}
              <TwoFactorAuth />

              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Key size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Production API Key</p>
                          <p className="text-sm text-gray-500 font-mono">
                            sk_prod_••••••••••••••••
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Revoke
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      + Create New API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Choose what updates you receive</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'campaignPerformanceReports',
                        label: 'Campaign Performance Reports',
                        description: 'Weekly summary of your campaigns',
                      },
                      {
                        key: 'newLeads',
                        label: 'New Leads',
                        description: 'When new leads are added',
                      },
                      {
                        key: 'meetingBookings',
                        label: 'Meeting Bookings',
                        description: 'When a prospect books a meeting',
                      },
                      {
                        key: 'replies',
                        label: 'Replies',
                        description: 'When someone replies to your emails',
                      },
                      {
                        key: 'aiInsights',
                        label: 'AI Insights',
                        description: 'When Ava finds optimization opportunities',
                      },
                    ].map(notification => (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{notification.label}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={Boolean(emailPrefs[notification.key])}
                          onChange={() =>
                            setEmailPrefs(prev => ({
                              ...prev,
                              [notification.key]: !prev[notification.key],
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Slack Notifications</CardTitle>
                  <CardDescription>Get updates in Slack</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          #
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Connect Slack</p>
                          <p className="text-sm text-gray-500">Real-time notifications</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() => {
                const current = getUserPreferences();
                saveUserPreferences({ ...current, emailNotifications: emailPrefs });
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
