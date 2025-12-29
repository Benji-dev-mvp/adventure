import { motion } from 'framer-motion';
import {
  X,
  Building2,
  User,
  Mail,
  Linkedin,
  Globe,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Activity,
} from 'lucide-react';

// Local type definitions
interface EntityData {
  industry?: string;
  employees?: number;
  revenue?: string;
  engagementScore?: number;
  title?: string;
  email?: string;
  website?: string;
}

interface Entity {
  id?: string;
  name?: string;
  label?: string;
  data?: EntityData;
  score?: number;
  intentLevel?: string;
  fitScore?: string;
  stage?: string;
}

interface IntelligencePanelProps {
  entity: Entity | null;
  type: 'account' | 'contact';
  onClose: () => void;
  onAction?: (action: string, data: unknown) => void;
}

/**
 * Intelligence Panel Component
 * Side panel for displaying detailed entity information
 */

const IntelligencePanel = ({ entity, type, onClose, onAction }: IntelligencePanelProps) => {
  if (!entity) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-96 bg-gray-900 border-l border-gray-800 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
        <div className="flex items-center gap-3">
          {type === 'account' ? (
            <Building2 className="w-5 h-5 text-violet-400" />
          ) : (
            <User className="w-5 h-5 text-violet-400" />
          )}
          <div>
            <h3 className="font-semibold text-white">{entity.name || entity.label}</h3>
            <p className="text-xs text-gray-400">
              {type === 'account' ? entity.data?.industry : entity.data?.title}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Score Overview */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Overall Score</span>
            <span className="text-2xl font-bold text-white">{entity.score}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${entity.score}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <div className={`text-xs font-medium capitalize ${
                entity.intentLevel === 'hot' ? 'text-red-400' :
                entity.intentLevel === 'warm' ? 'text-amber-400' :
                'text-blue-400'
              }`}>
                {entity.intentLevel}
              </div>
              <div className="text-[10px] text-gray-500">Intent</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-green-400 capitalize">{entity.fitScore}</div>
              <div className="text-[10px] text-gray-500">Fit</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-violet-400 capitalize">{entity.stage}</div>
              <div className="text-[10px] text-gray-500">Stage</div>
            </div>
          </div>
        </div>

        {/* Entity Details */}
        {type === 'account' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Company Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {entity.data?.industry && (
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Industry</div>
                  <div className="text-white">{entity.data.industry}</div>
                </div>
              )}
              {entity.data?.employees && (
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Employees</div>
                  <div className="text-white">{entity.data.employees.toLocaleString()}</div>
                </div>
              )}
              {entity.data?.revenue && (
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Revenue</div>
                  <div className="text-white">{entity.data.revenue}</div>
                </div>
              )}
              {entity.data?.engagementScore !== undefined && (
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-gray-500 text-xs">Engagement</div>
                  <div className="text-white">{entity.data.engagementScore}%</div>
                </div>
              )}
            </div>
          </div>
        )}

        {type === 'contact' && (
          <>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Contact Details</h4>
              <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                {entity.data?.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Title</span>
                    <span className="text-sm text-white">{entity.data.title}</span>
                  </div>
                )}
                {entity.data?.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Email</span>
                    <span className="text-sm text-white">{entity.data.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => onAction?.('email', entity)}
                className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button 
                onClick={() => onAction?.('linkedin', entity)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
          </>
        )}

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {[
              { action: 'Opened email', time: '2 hours ago', icon: Mail },
              { action: 'Visited pricing page', time: '1 day ago', icon: Globe },
              { action: 'Downloaded whitepaper', time: '3 days ago', icon: TrendingUp },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2">
                <activity.icon className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {[
              { action: 'Send personalized follow-up', priority: 'high', reason: 'High engagement detected' },
              { action: 'Schedule discovery call', priority: 'medium', reason: 'Qualified lead signals' },
            ].map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onAction?.('recommendation', rec)}
                className="bg-gray-800/50 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full ${
                  rec.priority === 'high' ? 'bg-green-400' :
                  rec.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <div className="text-sm text-white">{rec.action}</div>
                  <div className="text-xs text-gray-500">{rec.reason}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { IntelligencePanel };
export default IntelligencePanel;
