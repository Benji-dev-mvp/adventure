import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

// Import navConfig to get all routes
const getAllRoutes = () => {
  // Simplified route list - in production, import from navConfig
  return [
    { path: '/', name: 'Home' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/campaigns', name: 'Campaigns' },
    { path: '/leads', name: 'Leads' },
    { path: '/analytics', name: 'Analytics' },
    { path: '/ai-assistant', name: 'AI Assistant' },
    { path: '/integrations', name: 'Integrations' },
    { path: '/settings', name: 'Settings' },
    { path: '/templates', name: 'Templates' },
    { path: '/admin', name: 'Admin' },
  ];
};

interface RouteStatus {
  path: string;
  name: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
  loadTime?: number;
}

export default function HealthRoutesPage() {
  const [routes, setRoutes] = useState<RouteStatus[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const allRoutes = getAllRoutes();
    setRoutes(
      allRoutes.map(r => ({
        ...r,
        status: 'pending' as const,
      }))
    );
  }, []);

  const testRoute = async (route: RouteStatus): Promise<RouteStatus> => {
    const startTime = performance.now();

    try {
      // Create a hidden iframe to test route loading
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = route.path;
      document.body.appendChild(iframe);

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 5000);

        iframe.onload = () => {
          clearTimeout(timeout);
          resolve(null);
        };

        iframe.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load'));
        };
      });

      document.body.removeChild(iframe);

      return {
        ...route,
        status: 'success',
        loadTime: performance.now() - startTime,
      };
    } catch (error) {
      return {
        ...route,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        loadTime: performance.now() - startTime,
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);

    for (let i = 0; i < routes.length; i++) {
      const result = await testRoute(routes[i]);
      setRoutes(prev => {
        const updated = [...prev];
        updated[i] = result;
        return updated;
      });
    }

    setTesting(false);
  };

  const getStatusIcon = (status: RouteStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const stats = {
    total: routes.length,
    success: routes.filter(r => r.status === 'success').length,
    error: routes.filter(r => r.status === 'error').length,
    pending: routes.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Route Health Check
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test all navigation routes for runtime stability
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Routes</div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passing</div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.error}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Failing</div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-400">{stats.pending}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <CardTitle className="">Actions</CardTitle>
            <button
              onClick={runAllTests}
              disabled={testing}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Testing...' : 'Run All Tests'}
            </button>
          </div>
        </CardHeader>
      </Card>

      <Card className="">
        <CardHeader className="">
          <CardTitle className="">Route Status</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-2">
            {routes.map(route => (
              <div
                key={route.path}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(route.status)}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{route.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{route.path}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {route.loadTime && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {route.loadTime.toFixed(0)}ms
                    </span>
                  )}
                  {route.error && <span className="text-sm text-red-600">{route.error}</span>}
                  <Link to={route.path} className="text-sm text-primary-600 hover:text-primary-700">
                    Visit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
