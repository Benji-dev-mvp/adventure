// Security & Compliance Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Shield, FileText, Trash2, Lock, Monitor, Key, Eye, BarChart3 } from 'lucide-react';

export const GDPRComplianceCenter = () => {
  const [requests, setRequests] = useState([
    { type: 'Data Access', user: 'john@example.com', date: 'Dec 24', status: 'pending' },
    { type: 'Data Deletion', user: 'jane@example.com', date: 'Dec 23', status: 'completed' },
    { type: 'Data Export', user: 'bob@example.com', date: 'Dec 22', status: 'processing' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="text-primary-500" size={20} />
          <CardTitle>GDPR Compliance Center</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-lg font-bold">98%</p>
              <p className="text-xs text-gray-600">Compliance Score</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-lg font-bold">12</p>
              <p className="text-xs text-gray-600">Consent Records</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-lg font-bold">3</p>
              <p className="text-xs text-gray-600">Pending Requests</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-sm">Recent Requests</h4>
            <div className="space-y-2">
              {requests.map((req, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{req.type}</p>
                    <p className="text-xs text-gray-600">{req.user}</p>
                  </div>
                  <Badge
                    variant={
                      req.status === 'completed'
                        ? 'success'
                        : req.status === 'processing'
                          ? 'warning'
                          : 'secondary'
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SOC2AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      event: 'User login',
      user: 'admin@company.com',
      ip: '192.168.1.1',
      time: '2 min ago',
      severity: 'info',
    },
    {
      event: 'Data export',
      user: 'sarah@company.com',
      ip: '192.168.1.5',
      time: '15 min ago',
      severity: 'warning',
    },
    {
      event: 'Permission change',
      user: 'admin@company.com',
      ip: '192.168.1.1',
      time: '1 hour ago',
      severity: 'critical',
    },
    {
      event: 'API key created',
      user: 'mike@company.com',
      ip: '192.168.1.8',
      time: '2 hours ago',
      severity: 'warning',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="text-primary-500" size={20} />
          <CardTitle>SOC 2 Audit Logs</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{log.event}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {log.user} • {log.ip}
                  </p>
                </div>
                <Badge
                  variant={
                    log.severity === 'critical'
                      ? 'error'
                      : log.severity === 'warning'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {log.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{log.time}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Export Full Log
        </Button>
      </CardContent>
    </Card>
  );
};

export const DataRetentionPolicies = () => {
  const policies = [
    { dataType: 'Lead Data', retention: '7 years', autoDelete: true, lastCleaned: '30 days ago' },
    { dataType: 'Email Logs', retention: '2 years', autoDelete: true, lastCleaned: '7 days ago' },
    { dataType: 'Session Data', retention: '90 days', autoDelete: true, lastCleaned: 'Yesterday' },
    { dataType: 'Audit Logs', retention: '10 years', autoDelete: false, lastCleaned: 'Never' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trash2 className="text-primary-500" size={20} />
          <CardTitle>Data Retention Policies</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {policies.map((policy, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{policy.dataType}</h4>
                  <p className="text-xs text-gray-600 mt-1">Retention: {policy.retention}</p>
                </div>
                <Badge variant={policy.autoDelete ? 'success' : 'secondary'}>
                  {policy.autoDelete ? 'Auto-delete ON' : 'Manual'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Last cleaned: {policy.lastCleaned}</p>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Configure Policies</Button>
      </CardContent>
    </Card>
  );
};

export const IPWhitelistManager = () => {
  const [whitelist, setWhitelist] = useState([
    { ip: '192.168.1.0/24', label: 'Office Network', addedBy: 'Admin', date: 'Dec 1' },
    { ip: '10.0.0.0/8', label: 'VPN Network', addedBy: 'Admin', date: 'Nov 15' },
    { ip: '203.45.67.89', label: 'Mike - Home', addedBy: 'Admin', date: 'Dec 10' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="text-primary-500" size={20} />
          <CardTitle>IP Whitelist Manager</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {whitelist.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-mono text-sm font-semibold">{item.ip}</p>
                <p className="text-xs text-gray-600">{item.label}</p>
              </div>
              <Button size="sm" variant="ghost">
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Input placeholder="Enter IP or CIDR range" />
          <Button>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SessionManagement = () => {
  const [sessions, setSessions] = useState([
    {
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      lastActive: '2 min ago',
      current: true,
    },
    {
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      current: false,
    },
    {
      device: 'Firefox on Windows',
      location: 'New York, NY',
      lastActive: '3 hours ago',
      current: false,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Monitor className="text-primary-500" size={20} />
          <CardTitle>Session Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{session.device}</h4>
                  <p className="text-xs text-gray-600 mt-1">{session.location}</p>
                </div>
                {session.current ? (
                  <Badge variant="success">Current</Badge>
                ) : (
                  <Button size="sm" variant="ghost">
                    Revoke
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Revoke All Sessions
        </Button>
      </CardContent>
    </Card>
  );
};

export const EncryptionKeyRotation = () => {
  const [keys, setKeys] = useState([
    {
      id: 'key-2025-12',
      type: 'AES-256',
      status: 'active',
      created: 'Dec 1, 2025',
      expires: 'Mar 1, 2026',
    },
    {
      id: 'key-2025-09',
      type: 'AES-256',
      status: 'rotated',
      created: 'Sep 1, 2025',
      expires: 'Dec 1, 2025',
    },
    {
      id: 'key-2025-06',
      type: 'AES-256',
      status: 'archived',
      created: 'Jun 1, 2025',
      expires: 'Sep 1, 2025',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="text-primary-500" size={20} />
          <CardTitle>Encryption Key Rotation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {keys.map(key => (
            <div key={key.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-sm font-semibold">{key.id}</p>
                  <p className="text-xs text-gray-600 mt-1">{key.type}</p>
                </div>
                <Badge
                  variant={
                    key.status === 'active'
                      ? 'success'
                      : key.status === 'rotated'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {key.status}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Created: {key.created}</span>
                <span>Expires: {key.expires}</span>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Rotate Keys Now</Button>
      </CardContent>
    </Card>
  );
};

export const DataPrivacyDashboard = () => {
  const [scanResults, setScanResults] = useState({
    totalRecords: 15234,
    piiFound: 842,
    masked: 789,
    unmasked: 53,
    lastScan: '2 hours ago',
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="text-primary-500" size={20} />
          <CardTitle>Data Privacy Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Records</p>
              <p className="text-lg font-bold">{scanResults.totalRecords.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">PII Detected</p>
              <p className="text-lg font-bold">{scanResults.piiFound}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>PII Masking Progress</span>
              <span className="font-semibold">
                {Math.round((scanResults.masked / scanResults.piiFound) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${(scanResults.masked / scanResults.piiFound) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {scanResults.unmasked} records need attention
            </p>
          </div>

          <Button className="w-full">Run PII Scan</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ComplianceReporting = () => {
  const reports = [
    { name: 'GDPR Compliance Report', date: 'Dec 2025', status: 'ready', format: 'PDF' },
    { name: 'SOC 2 Audit Report', date: 'Q4 2025', status: 'generating', format: 'PDF' },
    { name: 'Data Breach Assessment', date: 'Dec 2025', status: 'ready', format: 'Excel' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary-500" size={20} />
          <CardTitle>Compliance Reporting</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-semibold text-sm">{report.name}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  {report.date} • {report.format}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={report.status === 'ready' ? 'success' : 'warning'}>
                  {report.status}
                </Badge>
                {report.status === 'ready' && (
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Generate New Report</Button>
      </CardContent>
    </Card>
  );
};
