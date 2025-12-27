import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SystemHealthDashboard } from '../components/SystemHealthDashboard';
import { Activity } from 'lucide-react';

/**
 * System Status Page
 * 
 * Displays comprehensive health monitoring for all backend services.
 */
const SystemStatus = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          </div>
          <p className="text-gray-600">
            Monitor the health and performance of all backend services and system resources.
          </p>
        </div>

        {/* System Health Dashboard */}
        <SystemHealthDashboard />
      </div>
    </DashboardLayout>
  );
};

export default SystemStatus;
