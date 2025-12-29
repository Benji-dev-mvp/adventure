import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  TabsRadix,
  TabsListRadix,
  TabsTriggerRadix,
  TabsContentRadix,
} from '../components/ui/TabsRadix';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { Sparkles, Palette, Code2, Zap, Check, X, Settings } from 'lucide-react';

const UIShowcase = () => {
  const [selectedFramework, setSelectedFramework] = useState('react-vite');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-purple-coral p-12 text-white shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-10 h-10" />
              <Badge variant="outline" className="border-white text-white">
                Design System 2.0
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-3">Advanced UI Architecture</h1>
            <p className="text-lg text-white/90 max-w-3xl">
              Artisan now features a dual UI system: <strong>Shadcn/ui</strong> (premium Radix UI
              components) + <strong>DaisyUI</strong> (rapid prototyping utilities). Both work
              seamlessly with your existing Tailwind CSS setup.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Framework Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Stack: React + Vite + Tailwind CSS</CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Perfect foundation for modern UI systems
                </p>
              </div>
              <Badge variant="success">✓ Optimal Setup</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-500/10">
                <Check className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">React + Vite</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Lightning-fast HMR, modern build tooling, perfect for enterprise apps
                </p>
              </div>
              <div className="p-6 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-500/10">
                <Check className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Tailwind CSS</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Utility-first styling, customizable theme, no CSS bloat
                </p>
              </div>
              <div className="p-6 rounded-xl border-2 border-purple-500 bg-purple-50 dark:bg-purple-500/10">
                <Check className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">TypeScript Ready</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Optional type safety when needed, JSX works great too
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                Why NOT migrate to other frameworks?
              </h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline">Next.js</Badge>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Great for SSR/SEO but overkill for your B2B dashboard (no public content to
                    rank)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline">Nuxt/Vue</Badge>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Complete rewrite required, React ecosystem better for enterprise
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline">SvelteKit</Badge>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Smaller ecosystem, harder to hire developers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shadcn/ui Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent-500" />
              Shadcn/ui Components (Radix UI Primitives)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Premium, accessible components you own and customize. No package dependency, copied
              into your codebase.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Buttons */}
            <div>
              <h4 className="font-semibold mb-3">
                Enhanced Button with CVA (Class Variance Authority)
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">
                  Primary Small
                </Button>
                <Button variant="secondary" size="md">
                  Secondary
                </Button>
                <Button variant="outline" size="lg">
                  Outline Large
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="gradient" size="xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gradient XL
                </Button>
              </div>
            </div>

            {/* Dialog Component */}
            <div>
              <h4 className="font-semibold mb-3">Radix UI Dialog (Accessible Modal)</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary">Open Premium Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Set up your multi-channel outbound campaign with Ava AI. Includes email,
                      LinkedIn, SMS, and calls.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                      <input
                        type="text"
                        placeholder="Q1 2025 Enterprise Outreach"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 focus:ring-2 focus:ring-accent-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Audience</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select audience segment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                          <SelectItem value="mid-market">Mid-Market (50-500)</SelectItem>
                          <SelectItem value="smb">SMB (1-50)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="gradient">Create Campaign</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Radix Tabs */}
            <div>
              <h4 className="font-semibold mb-3">Radix UI Tabs (Keyboard Accessible)</h4>
              <TabsRadix defaultValue="overview" className="w-full">
                <TabsListRadix>
                  <TabsTriggerRadix value="overview">Overview</TabsTriggerRadix>
                  <TabsTriggerRadix value="analytics">Analytics</TabsTriggerRadix>
                  <TabsTriggerRadix value="settings">Settings</TabsTriggerRadix>
                </TabsListRadix>
                <TabsContentRadix value="overview">
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-400">
                        Campaign overview data with real-time metrics. This tab content is
                        accessible via keyboard (Tab → Arrow keys).
                      </p>
                    </CardContent>
                  </Card>
                </TabsContentRadix>
                <TabsContentRadix value="analytics">
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-400">
                        Advanced analytics and performance insights.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContentRadix>
                <TabsContentRadix value="settings">
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-400">
                        Configure campaign settings and preferences.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContentRadix>
              </TabsRadix>
            </div>

            {/* Code Example */}
            <div className="p-6 bg-gray-900 rounded-xl text-white overflow-x-auto">
              <code className="text-sm font-mono">
                {`import { Button } from '@/components/ui/Button';\nimport { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';\n\n<Dialog>\n  <DialogTrigger asChild>\n    <Button variant="gradient">Open Modal</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Your Content</DialogTitle>\n  </DialogContent>\n</Dialog>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* DaisyUI Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              DaisyUI Components (Rapid Prototyping)
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              60+ semantic class-based components. Perfect for quick iterations and MVPs.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* DaisyUI Buttons */}
            <div>
              <h4 className="font-semibold mb-3">DaisyUI Semantic Buttons (No Custom CSS)</h4>
              <div className="flex flex-wrap gap-3">
                <button className="daisy-btn daisy-btn-primary">Primary</button>
                <button className="daisy-btn daisy-btn-secondary">Secondary</button>
                <button className="daisy-btn daisy-btn-accent">Accent</button>
                <button className="daisy-btn daisy-btn-info">Info</button>
                <button className="daisy-btn daisy-btn-success">Success</button>
                <button className="daisy-btn daisy-btn-warning">Warning</button>
                <button className="daisy-btn daisy-btn-error">Error</button>
                <button className="daisy-btn daisy-btn-ghost">Ghost</button>
              </div>
            </div>

            {/* DaisyUI Alerts */}
            <div>
              <h4 className="font-semibold mb-3">DaisyUI Alerts (Pre-styled)</h4>
              <div className="space-y-3">
                <div className="daisy-alert daisy-alert-info">
                  <span>New campaign metrics available! Check your dashboard for updates.</span>
                </div>
                <div className="daisy-alert daisy-alert-success">
                  <span>✓ Campaign "Q4 Outreach" successfully launched to 1,234 leads.</span>
                </div>
                <div className="daisy-alert daisy-alert-warning">
                  <span>⚠ Email deliverability rate below 95%. Review your sending domain.</span>
                </div>
              </div>
            </div>

            {/* DaisyUI Stats */}
            <div>
              <h4 className="font-semibold mb-3">DaisyUI Stats (Dashboard Widgets)</h4>
              <div className="daisy-stats daisy-stats-vertical lg:daisy-stats-horizontal shadow-lg border border-gray-200 dark:border-white/20">
                <div className="daisy-stat">
                  <div className="daisy-stat-title">Total Campaigns</div>
                  <div className="daisy-stat-value">127</div>
                  <div className="daisy-stat-desc">↗︎ 12% this month</div>
                </div>
                <div className="daisy-stat">
                  <div className="daisy-stat-title">Open Rate</div>
                  <div className="daisy-stat-value">58.2%</div>
                  <div className="daisy-stat-desc">↗︎ +4.3% vs last month</div>
                </div>
                <div className="daisy-stat">
                  <div className="daisy-stat-title">Revenue Pipeline</div>
                  <div className="daisy-stat-value">$2.4M</div>
                  <div className="daisy-stat-desc">↗︎ 23% growth</div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="p-6 bg-gray-900 rounded-xl text-white overflow-x-auto">
              <code className="text-sm font-mono">
                {`<!-- No imports needed, just Tailwind classes -->\n<button className="daisy-btn daisy-btn-primary">\n  Click Me\n</button>\n\n<div className="daisy-alert daisy-alert-success">\n  <span>Success message!</span>\n</div>`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Decision Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              When to Use Each System?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-500/10 border-2 border-purple-500">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Use Shadcn/ui When:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Building core
                    product features
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Need full design
                    control & customization
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Accessibility is
                    critical (WCAG 2.1)
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Want to own the
                    component code
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Complex
                    interactions (dialogs, popovers, selects)
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 border-2 border-yellow-500">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Use DaisyUI When:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Rapid prototyping &
                    MVPs
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Internal admin
                    dashboards
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Quick mockups for
                    stakeholders
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Simple UI patterns
                    (alerts, badges, stats)
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> Want to ship fast
                    without custom CSS
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Summary */}
        <Card className="bg-gradient-to-r from-accent-500/10 to-purple-500/10 border-2 border-accent-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent-500 text-white">
                <Code2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">🎉 Your New Architecture Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold mb-1">⚡ Better Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Class Variance Authority reduces runtime CSS-in-JS overhead
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">♿ Accessibility First</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Radix UI primitives are WCAG 2.1 compliant out of the box
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">🎨 Design Flexibility</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mix Shadcn, DaisyUI, and custom components as needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Summary */}
        <Card>
          <CardHeader>
            <CardTitle>✅ What's Already Installed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <span className="font-mono text-sm">class-variance-authority</span>
                <Badge variant="success">✓ Installed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <span className="font-mono text-sm">@radix-ui/react-dialog</span>
                <Badge variant="success">✓ Installed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <span className="font-mono text-sm">@radix-ui/react-select</span>
                <Badge variant="success">✓ Installed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <span className="font-mono text-sm">@radix-ui/react-tabs</span>
                <Badge variant="success">✓ Installed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <span className="font-mono text-sm">daisyui</span>
                <Badge variant="success">✓ Installed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UIShowcase;
