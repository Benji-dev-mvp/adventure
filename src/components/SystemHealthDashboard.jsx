import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, Wifi, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';

/**
 * System Health Dashboard Component
 * 
 * Displays the health status of all backend services and system resources.
 */
export const SystemHealthDashboard = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/system/health');
      if (!response.ok) throw new Error('Failed to fetch health data');
      const data = await response.json();
      setHealth(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching health:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading && !health) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <Activity className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading system health...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load System Health</h3>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={fetchHealth}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">System Health</h2>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor(health?.status)}`}>
            {getStatusIcon(health?.status)}
            <div>
              <p className="font-semibold">Overall Status: {health?.status?.toUpperCase()}</p>
              {lastUpdate && (
                <p className="text-xs mt-1">Last updated: {lastUpdate.toLocaleTimeString()}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Services Status */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
          <div className="space-y-3">
            {health?.services?.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {service.name.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{service.message}</p>
                    {service.response_time_ms && (
                      <p className="text-xs text-gray-500 mt-1">
                        Response time: {service.response_time_ms.toFixed(2)}ms
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* System Resources */}
      {health?.system_info && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  <p className="font-medium text-gray-900">CPU</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {health.system_info.cpu_percent?.toFixed(1)}%
                </p>
              </div>

              {/* Memory */}
              {health.system_info.memory && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <p className="font-medium text-gray-900">Memory</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {health.system_info.memory.percent?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatBytes(health.system_info.memory.used)} / {formatBytes(health.system_info.memory.total)}
                  </p>
                </div>
              )}

              {/* Disk */}
              {health.system_info.disk && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-gray-900">Disk</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {health.system_info.disk.percent?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatBytes(health.system_info.disk.used)} / {formatBytes(health.system_info.disk.total)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SystemHealthDashboard;
