/**
 * AI Playbooks Manager
 *
 * Allows users to create, manage, and run AI-powered sales playbooks
 * that automate outreach sequences based on ICP filters and channel mix.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Play,
  Pause,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Target,
  Mail,
  Linkedin,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Zap,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useToast } from '../Toast';
import { AnimatedCounter } from '../ui/AnimatedComponents';

// Playbook status badges
const StatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

// Goal icons
const GoalIcon = ({ goal }) => {
  const icons = {
    meetings: Calendar,
    replies: Mail,
    engagement: TrendingUp,
    pipeline: Target,
  };
  const Icon = icons[goal] || Target;
  return <Icon size={16} />;
};

GoalIcon.propTypes = {
  goal: PropTypes.string.isRequired,
};

// Channel mix indicator
const ChannelMix = ({ channels = {} }) => {
  const channelConfig = {
    email: { icon: Mail, color: 'text-blue-500', label: 'Email' },
    linkedin: { icon: Linkedin, color: 'text-blue-700', label: 'LinkedIn' },
    phone: { icon: Phone, color: 'text-green-500', label: 'Phone' },
  };

  return (
    <div className="flex gap-2">
      {Object.entries(channels).map(([key, value]) => {
        const config = channelConfig[key];
        if (!config || !value) return null;
        const Icon = config.icon;
        return (
          <div
            key={key}
            className={`flex items-center gap-1 text-xs ${config.color}`}
            title={`${config.label}: ${value}%`}
          >
            <Icon size={14} />
            <span>{value}%</span>
          </div>
        );
      })}
    </div>
  );
};

ChannelMix.propTypes = {
  channels: PropTypes.objectOf(PropTypes.number),
};

// Create/Edit Playbook Modal
const PlaybookModal = ({ playbook, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: playbook?.name || '',
    description: playbook?.description || '',
    segment: playbook?.segment || 'midmarket',
    goal: playbook?.goal || 'meetings',
    target_metric: playbook?.target_metric || 10,
    icp_filters: playbook?.icp_filters || {
      industries: [],
      company_size: [],
      job_titles: [],
    },
    channel_mix: playbook?.channel_mix || {
      email: 60,
      linkedin: 30,
      phone: 10,
    },
    schedule_frequency: playbook?.schedule_frequency || 'daily',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {playbook ? 'Edit Playbook' : 'Create New Playbook'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="playbook-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Playbook Name
              </label>
              <input
                id="playbook-name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Enterprise Tech Outreach"
                required
              />
            </div>

            <div>
              <label
                htmlFor="playbook-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="playbook-description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the playbook strategy..."
                rows={3}
              />
            </div>
          </div>

          {/* Segment & Goal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="playbook-segment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Target Segment
              </label>
              <select
                id="playbook-segment"
                value={form.segment}
                onChange={e => setForm({ ...form, segment: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="startup">Startup (1-50)</option>
                <option value="midmarket">Mid-Market (51-500)</option>
                <option value="enterprise">Enterprise (500+)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="playbook-goal"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Primary Goal
              </label>
              <select
                id="playbook-goal"
                value={form.goal}
                onChange={e => setForm({ ...form, goal: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="meetings">Book Meetings</option>
                <option value="replies">Generate Replies</option>
                <option value="engagement">Drive Engagement</option>
                <option value="pipeline">Build Pipeline</option>
              </select>
            </div>
          </div>

          {/* Channel Mix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Channel Mix
            </label>
            <div className="space-y-3">
              {['email', 'linkedin', 'phone'].map(channel => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="w-20 text-sm capitalize text-gray-600 dark:text-gray-400">
                    {channel}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.channel_mix[channel] || 0}
                    onChange={e =>
                      setForm({
                        ...form,
                        channel_mix: {
                          ...form.channel_mix,
                          [channel]: Number.parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-gray-700 dark:text-gray-300">
                    {form.channel_mix[channel] || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label
              htmlFor="playbook-frequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Run Frequency
            </label>
            <select
              id="playbook-frequency"
              value={form.schedule_frequency}
              onChange={e => setForm({ ...form, schedule_frequency: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="manual">Manual Only</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {playbook ? 'Save Changes' : 'Create Playbook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PlaybookModal.propTypes = {
  playbook: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    segment: PropTypes.string,
    goal: PropTypes.string,
    target_metric: PropTypes.number,
    icp_filters: PropTypes.object,
    channel_mix: PropTypes.object,
    schedule_frequency: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Run History Modal
const RunHistoryModal = ({ playbook, runs, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Run History: {playbook.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Started
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Leads
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Emails
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Responses
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Meetings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {runs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No runs yet. Click "Run Now" to execute this playbook.
                  </td>
                </tr>
              ) : (
                runs.map(run => (
                  <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {run.started_at ? new Date(run.started_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {run.leads_targeted || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {run.emails_sent || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700 dark:text-gray-300">
                      {run.responses || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-green-600 dark:text-green-400">
                      {run.meetings_booked || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

RunHistoryModal.propTypes = {
  playbook: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  runs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
      started_at: PropTypes.string,
      leads_targeted: PropTypes.number,
      emails_sent: PropTypes.number,
      responses: PropTypes.number,
      meetings_booked: PropTypes.number,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

// Playbook Card
const PlaybookCard = ({ playbook, onRun, onEdit, onPause, onActivate, onDelete, onViewRuns }) => {
  const [running, setRunning] = useState(false);
  const { showToast } = useToast();

  const handleRun = async () => {
    setRunning(true);
    try {
      await onRun(playbook.id);
      showToast('Playbook run started! Ava is now executing the sequence.', 'success');
    } catch (err) {
      showToast('Failed to start playbook run', 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <GoalIcon goal={playbook.goal} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{playbook.name}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {playbook.segment} segment
              </span>
            </div>
          </div>
          <StatusBadge status={playbook.status} />
        </div>
        {playbook.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {playbook.description}
          </p>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <div className="p-3 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={playbook.total_runs || 0} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Runs</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={playbook.total_leads_targeted || 0} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Leads</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            <AnimatedCounter end={playbook.total_responses || 0} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Responses</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            <AnimatedCounter end={playbook.total_meetings || 0} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Meetings</div>
        </div>
      </div>

      {/* Channel Mix */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <ChannelMix channels={playbook.channel_mix} />
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {playbook.schedule_frequency || 'manual'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(playbook)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onViewRuns(playbook)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Run History"
          >
            <BarChart3 size={16} />
          </button>
          <button
            onClick={() => onDelete(playbook.id)}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          {playbook.status === 'active' ? (
            <button
              onClick={() => onPause(playbook.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            >
              <Pause size={14} />
              Pause
            </button>
          ) : (
            playbook.status !== 'archived' && (
              <button
                onClick={() => onActivate(playbook.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                <CheckCircle size={14} />
                Activate
              </button>
            )
          )}
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run Now
          </button>
        </div>
      </div>
    </div>
  );
};

PlaybookCard.propTypes = {
  playbook: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    segment: PropTypes.string,
    goal: PropTypes.string,
    status: PropTypes.string,
    total_runs: PropTypes.number,
    total_leads_targeted: PropTypes.number,
    total_responses: PropTypes.number,
    total_meetings: PropTypes.number,
    channel_mix: PropTypes.object,
    schedule_frequency: PropTypes.string,
  }).isRequired,
  onRun: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewRuns: PropTypes.func.isRequired,
};

// Summary Stats
const PlaybooksSummary = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
          <Zap size={20} />
          <span className="text-sm font-medium">Active Playbooks</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.active_playbooks} / {stats.total_playbooks}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
          <Users size={20} />
          <span className="text-sm font-medium">Leads Targeted</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <AnimatedCounter end={stats.total_leads_targeted} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
          <TrendingUp size={20} />
          <span className="text-sm font-medium">Response Rate</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.response_rate}%
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 mb-2">
          <Calendar size={20} />
          <span className="text-sm font-medium">Meetings Booked</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <AnimatedCounter end={stats.total_meetings} />
        </div>
      </div>
    </div>
  );
};

PlaybooksSummary.propTypes = {
  stats: PropTypes.shape({
    active_playbooks: PropTypes.number,
    total_playbooks: PropTypes.number,
    total_leads_targeted: PropTypes.number,
    response_rate: PropTypes.number,
    total_meetings: PropTypes.number,
  }),
};

// Main Playbooks Manager Component
export const AIPlaybooksManager = () => {
  const { showToast } = useToast();
  const [playbooks, setPlaybooks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState(null);
  const [runHistoryPlaybook, setRunHistoryPlaybook] = useState(null);
  const [runHistory, setRunHistory] = useState([]);

  // Fetch playbooks
  const fetchPlaybooks = async () => {
    try {
      const res = await fetch('/api/playbooks');
      if (res.ok) {
        const data = await res.json();
        setPlaybooks(data);
      }
    } catch (err) {
      console.error('Failed to fetch playbooks:', err);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/playbooks/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  // Load on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchPlaybooks(), fetchSummary()]);
      setLoading(false);
    };
    load();
  }, []);

  // Create/Update playbook
  const handleSave = async formData => {
    const method = editingPlaybook ? 'PATCH' : 'POST';
    const url = editingPlaybook ? `/api/playbooks/${editingPlaybook.id}` : '/api/playbooks';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(editingPlaybook ? 'Playbook updated!' : 'Playbook created!', 'success');
        setShowModal(false);
        setEditingPlaybook(null);
        await Promise.all([fetchPlaybooks(), fetchSummary()]);
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      showToast('Failed to save playbook', 'error');
    }
  };

  // Run playbook
  const handleRun = async playbookId => {
    const res = await fetch(`/api/playbooks/${playbookId}/run`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Run failed');
    await Promise.all([fetchPlaybooks(), fetchSummary()]);
  };

  // Pause playbook
  const handlePause = async playbookId => {
    try {
      const res = await fetch(`/api/playbooks/${playbookId}/pause`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('Playbook paused', 'info');
        await fetchPlaybooks();
      }
    } catch (err) {
      showToast('Failed to pause playbook', 'error');
    }
  };

  // Activate playbook
  const handleActivate = async playbookId => {
    try {
      const res = await fetch(`/api/playbooks/${playbookId}/activate`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast('Playbook activated!', 'success');
        await fetchPlaybooks();
      }
    } catch (err) {
      showToast('Failed to activate playbook', 'error');
    }
  };

  // Delete playbook
  const handleDelete = async playbookId => {
    if (!confirm('Are you sure you want to delete this playbook?')) return;

    try {
      const res = await fetch(`/api/playbooks/${playbookId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Playbook deleted', 'info');
        await Promise.all([fetchPlaybooks(), fetchSummary()]);
      }
    } catch (err) {
      showToast('Failed to delete playbook', 'error');
    }
  };

  // View run history
  const handleViewRuns = async playbook => {
    try {
      const res = await fetch(`/api/playbooks/${playbook.id}/runs`);
      if (res.ok) {
        const data = await res.json();
        setRunHistory(data);
        setRunHistoryPlaybook(playbook);
      }
    } catch (err) {
      showToast('Failed to load run history', 'error');
    }
  };

  // Edit playbook
  const handleEdit = playbook => {
    setEditingPlaybook(playbook);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="text-purple-500" size={24} />
            AI Playbooks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Automate your outreach with AI-powered sales sequences
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPlaybook(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors shadow-lg"
        >
          <Plus size={18} />
          Create Playbook
        </button>
      </div>

      {/* Summary Stats */}
      <PlaybooksSummary stats={summary} />

      {/* Playbooks Grid */}
      {playbooks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Playbooks Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Create your first AI playbook to automate outreach sequences and let Ava handle the
            prospecting.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <Plus size={18} />
            Create Your First Playbook
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {playbooks.map(playbook => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              onRun={handleRun}
              onEdit={handleEdit}
              onPause={handlePause}
              onActivate={handleActivate}
              onDelete={handleDelete}
              onViewRuns={handleViewRuns}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <PlaybookModal
          playbook={editingPlaybook}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingPlaybook(null);
          }}
        />
      )}

      {/* Run History Modal */}
      {runHistoryPlaybook && (
        <RunHistoryModal
          playbook={runHistoryPlaybook}
          runs={runHistory}
          onClose={() => {
            setRunHistoryPlaybook(null);
            setRunHistory([]);
          }}
        />
      )}
    </div>
  );
};

export default AIPlaybooksManager;
