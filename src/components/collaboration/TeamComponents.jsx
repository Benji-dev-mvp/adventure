// Team Collaboration Components
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input, Textarea } from '../ui/Input';
import {
  MessageSquare,
  Mail,
  Users,
  Calendar,
  Activity,
  Briefcase,
  Video,
  MessageCircle,
} from 'lucide-react';

export const SharedInbox = () => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: 'john@acme.com',
      subject: 'Re: Pricing question',
      assignedTo: 'Sarah',
      status: 'open',
      replies: 2,
    },
    {
      id: 2,
      from: 'jane@techco.com',
      subject: 'Demo request',
      assignedTo: 'Unassigned',
      status: 'new',
      replies: 0,
    },
    {
      id: 3,
      from: 'bob@startup.io',
      subject: 'Follow-up from call',
      assignedTo: 'Mike',
      status: 'in-progress',
      replies: 5,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="text-primary-500" size={20} />
          <CardTitle>Shared Team Inbox</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {emails.map(email => (
            <div
              key={email.id}
              className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{email.from}</h4>
                  <p className="text-xs text-gray-600 mt-1">{email.subject}</p>
                </div>
                <Badge
                  variant={
                    email.status === 'new'
                      ? 'error'
                      : email.status === 'open'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {email.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Assigned: {email.assignedTo}</span>
                <span>{email.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            Filter
          </Button>
          <Button size="sm" variant="outline">
            Sort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LeadNotesComments = () => {
  const [notes, setNotes] = useState([
    {
      user: 'Sarah',
      text: '@Mike can you follow up on the pricing question?',
      time: '2 min ago',
      mentions: ['Mike'],
    },
    {
      user: 'Mike',
      text: 'Had a great call today. They want to move forward!',
      time: '1 hour ago',
      mentions: [],
    },
    {
      user: 'Lisa',
      text: "@Sarah @Mike Let's schedule a handoff meeting",
      time: '3 hours ago',
      mentions: ['Sarah', 'Mike'],
    },
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary-500" size={20} />
          <CardTitle>Lead Notes & Comments</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
          {notes.map((note, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">{note.user}</span>
                <span className="text-xs text-gray-500">{note.time}</span>
              </div>
              <p className="text-sm">{note.text}</p>
              {note.mentions.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {note.mentions.map(mention => (
                    <Badge key={mention} variant="secondary" className="text-xs">
                      @{mention}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a note or @mention a teammate..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
          />
          <Button size="sm">Post</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const LeadHandoffWorkflow = () => {
  const [handoffs, setHandoffs] = useState([
    {
      lead: 'John Doe - Acme Corp',
      from: 'SDR: Sarah',
      to: 'AE: Mike',
      status: 'pending',
      score: 85,
    },
    {
      lead: 'Jane Smith - TechCo',
      from: 'SDR: Lisa',
      to: 'AE: Sarah',
      status: 'accepted',
      score: 92,
    },
    {
      lead: 'Bob Johnson - Startup',
      from: 'SDR: Mike',
      to: 'AE: Lisa',
      status: 'scheduled',
      score: 78,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="text-primary-500" size={20} />
          <CardTitle>Lead Handoff Workflow</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {handoffs.map((handoff, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{handoff.lead}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {handoff.from} → {handoff.to}
                  </p>
                </div>
                <Badge
                  variant={
                    handoff.status === 'pending'
                      ? 'warning'
                      : handoff.status === 'accepted'
                        ? 'success'
                        : 'secondary'
                  }
                >
                  {handoff.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Score: {handoff.score}</Badge>
                {handoff.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm">Accept</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const TeamCalendar = () => {
  const [events, setEvents] = useState([
    { title: 'Demo - Acme Corp', time: '10:00 AM', attendees: ['Sarah', 'Mike'], type: 'demo' },
    { title: 'Team Standup', time: '11:00 AM', attendees: ['All'], type: 'internal' },
    { title: 'Client Call - TechCo', time: '2:00 PM', attendees: ['Lisa'], type: 'call' },
    { title: 'Proposal Review', time: '4:00 PM', attendees: ['Sarah', 'Lisa'], type: 'internal' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-500" size={20} />
          <CardTitle>Team Calendar</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="p-3 border-l-4 rounded bg-gray-50 dark:bg-white/5"
              style={{
                borderLeftColor:
                  event.type === 'demo' ? '#3b82f6' : event.type === 'call' ? '#10b981' : '#6b7280',
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm">{event.title}</h4>
                <span className="text-xs text-gray-500">{event.time}</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {event.attendees.map(att => (
                  <Badge key={att} variant="secondary" className="text-xs">
                    {att}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Add Event</Button>
      </CardContent>
    </Card>
  );
};

export const TeamActivityFeed = () => {
  const activities = [
    {
      user: 'Sarah',
      action: 'closed a deal',
      target: 'Acme Corp - $45K',
      time: '5 min ago',
      icon: '🎉',
    },
    {
      user: 'Mike',
      action: 'scheduled demo with',
      target: 'TechCo',
      time: '15 min ago',
      icon: '📅',
    },
    {
      user: 'Lisa',
      action: 'sent proposal to',
      target: 'StartupXYZ',
      time: '1 hour ago',
      icon: '📄',
    },
    {
      user: 'Sarah',
      action: 'added 50 leads from',
      target: 'LinkedIn',
      time: '2 hours ago',
      icon: '➕',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-primary-500" size={20} />
          <CardTitle>Real-Time Activity Feed</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                  <span className="text-primary-600">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const DealRooms = () => {
  const [rooms, setRooms] = useState([
    {
      name: 'Acme Corp Deal',
      members: 4,
      files: 12,
      messages: 34,
      stage: 'Proposal',
      value: '$45K',
    },
    {
      name: 'TechCo Expansion',
      members: 3,
      files: 8,
      messages: 23,
      stage: 'Negotiation',
      value: '$78K',
    },
    { name: 'StartupXYZ Deal', members: 5, files: 15, messages: 56, stage: 'Demo', value: '$32K' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="text-primary-500" size={20} />
          <CardTitle>Deal Rooms</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rooms.map((room, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{room.name}</h4>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {room.stage}
                  </Badge>
                </div>
                <span className="font-bold text-primary-600">{room.value}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p className="font-bold">{room.members}</p>
                  <p className="text-gray-600">Members</p>
                </div>
                <div>
                  <p className="font-bold">{room.files}</p>
                  <p className="text-gray-600">Files</p>
                </div>
                <div>
                  <p className="font-bold">{room.messages}</p>
                  <p className="text-gray-600">Messages</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">+ Create Deal Room</Button>
      </CardContent>
    </Card>
  );
};

export const VideoCallIntegration = () => {
  const [recordings, setRecordings] = useState([
    {
      title: 'Demo - Acme Corp',
      duration: '45:32',
      date: 'Dec 20',
      participants: 3,
      transcribed: true,
    },
    {
      title: 'Discovery Call - TechCo',
      duration: '32:15',
      date: 'Dec 19',
      participants: 2,
      transcribed: true,
    },
    {
      title: 'Follow-up - StartupXYZ',
      duration: '28:43',
      date: 'Dec 18',
      participants: 4,
      transcribed: false,
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="text-primary-500" size={20} />
          <CardTitle>Video Call Integration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recordings.map((rec, idx) => (
            <div key={idx} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {rec.date} • {rec.participants} participants
                  </p>
                </div>
                <Badge variant="secondary">{rec.duration}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Play
                </Button>
                {rec.transcribed && (
                  <Button size="sm" variant="outline">
                    View Transcript
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Schedule New Meeting</Button>
      </CardContent>
    </Card>
  );
};

export const SlackTeamsBot = () => {
  const [notifications, setNotifications] = useState([
    { type: 'lead_created', channel: '#sales', enabled: true },
    { type: 'deal_won', channel: '#wins', enabled: true },
    { type: 'meeting_booked', channel: '#demos', enabled: true },
    { type: 'high_score_lead', channel: '#hot-leads', enabled: false },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="text-primary-500" size={20} />
          <CardTitle>Slack/Teams Bot</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
            <p className="text-sm font-medium">✓ Connected to Slack workspace</p>
            <p className="text-xs text-gray-600 mt-1">@ArtisanBot is active in 4 channels</p>
          </div>

          {notifications.map((notif, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p className="text-sm font-medium">{notif.type.replaceAll('_', ' ')}</p>
                <p className="text-xs text-gray-600">{notif.channel}</p>
              </div>
              <Badge variant={notif.enabled ? 'success' : 'secondary'}>
                {notif.enabled ? 'ON' : 'OFF'}
              </Badge>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4">Configure Notifications</Button>
      </CardContent>
    </Card>
  );
};
