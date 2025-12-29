import React from 'react';
import {
  Mail,
  Linkedin,
  Phone,
  MessageSquare,
  Clock,
  GitBranch,
  Play,
  Shuffle,
} from 'lucide-react';

// Re-export all nodes
export { EmailNode } from './EmailNode';
export { LinkedInNode } from './LinkedInNode';
export { CallNode } from './CallNode';
export { SMSNode } from './SMSNode';
export { DelayNode } from './DelayNode';
export { ConditionNode } from './ConditionNode';
export { TriggerNode } from './TriggerNode';
export { ABTestNode } from './ABTestNode';
export { default as BaseNode } from './BaseNode';

// Node type definitions for quick reference
export const nodeDefinitions = {
  trigger: {
    type: 'trigger',
    label: 'Trigger',
    icon: Play,
    color: 'green',
    category: 'triggers',
    description: 'Start your campaign workflow',
  },
  email: {
    type: 'email',
    label: 'Email',
    icon: Mail,
    color: 'blue',
    category: 'actions',
    description: 'Send an email to leads',
  },
  linkedin: {
    type: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'indigo',
    category: 'actions',
    description: 'Send LinkedIn message or connection',
  },
  call: {
    type: 'call',
    label: 'Phone Call',
    icon: Phone,
    color: 'emerald',
    category: 'actions',
    description: 'Schedule a phone call task',
  },
  sms: {
    type: 'sms',
    label: 'SMS',
    icon: MessageSquare,
    color: 'purple',
    category: 'actions',
    description: 'Send an SMS message',
  },
  delay: {
    type: 'delay',
    label: 'Delay',
    icon: Clock,
    color: 'orange',
    category: 'logic',
    description: 'Wait before the next step',
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    color: 'pink',
    category: 'logic',
    description: 'Branch based on conditions',
  },
  abtest: {
    type: 'abtest',
    label: 'A/B Test',
    icon: Shuffle,
    color: 'indigo',
    category: 'logic',
    description: 'Split traffic for testing',
  },
};

// Get nodes by category
export const getNodesByCategory = () => {
  const categories = {
    triggers: { label: 'Triggers', nodes: [] },
    actions: { label: 'Actions', nodes: [] },
    logic: { label: 'Logic', nodes: [] },
  };

  Object.values(nodeDefinitions).forEach(node => {
    if (categories[node.category]) {
      categories[node.category].nodes.push(node);
    }
  });

  return categories;
};
