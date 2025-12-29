import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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
  Calendar,
  Clock,
  Video,
  MapPin,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Plus,
  CheckCircle,
} from 'lucide-react';

const CalendarScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [meetingType, setMeetingType] = useState('demo');
  const [showSuccess, setShowSuccess] = useState(false);

  const upcomingMeetings = [
    {
      id: 1,
      lead: 'Sarah Chen',
      company: 'TechCorp',
      type: 'Demo',
      date: 'Jan 15, 2024',
      time: '2:00 PM',
      duration: '30 min',
      status: 'confirmed',
      meetingLink: 'https://meet.artisan.co/demo-sarah-chen',
    },
    {
      id: 2,
      lead: 'Michael Rodriguez',
      company: 'Growth Inc',
      type: 'Discovery',
      date: 'Jan 16, 2024',
      time: '10:00 AM',
      duration: '45 min',
      status: 'confirmed',
      meetingLink: 'https://meet.artisan.co/discovery-michael',
    },
    {
      id: 3,
      lead: 'Emily Watson',
      company: 'Enterprise Systems',
      type: 'Follow-up',
      date: 'Jan 17, 2024',
      time: '3:30 PM',
      duration: '15 min',
      status: 'pending',
      meetingLink: 'https://meet.artisan.co/followup-emily',
    },
  ];

  const availableSlots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
  ];

  const meetingTypes = [
    {
      id: 'demo',
      name: 'Product Demo',
      duration: '30 min',
      description: 'Live walkthrough of platform features',
    },
    {
      id: 'discovery',
      name: 'Discovery Call',
      duration: '45 min',
      description: 'Understanding your needs and goals',
    },
    { id: 'followup', name: 'Follow-up', duration: '15 min', description: 'Quick check-in or Q&A' },
    {
      id: 'onboarding',
      name: 'Onboarding',
      duration: '60 min',
      description: 'Getting started with Artisan',
    },
  ];

  const handleBookMeeting = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const copyMeetingLink = link => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied!');
  };

  return (
    <DashboardLayout
      title="Calendar & Scheduler"
      subtitle="Manage meetings and generate booking links"
    >
      <div className="space-y-3">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-9 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-semibold">Create Meeting Link</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Generate shareable booking link
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Meeting Link</DialogTitle>
                <DialogDescription>
                  Choose meeting type and generate shareable link
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  {meetingTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setMeetingType(type.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        meetingType === type.id
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10'
                          : 'border-gray-200 dark:border-white/10 hover:border-accent-300'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{type.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{type.duration}</p>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Your Meeting Link:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://meet.artisan.co/${meetingType}`}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded bg-white dark:bg-gray-900"
                    />
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="gradient">Generate Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-9 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-9 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">8.5h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meeting Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-9 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">89%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show-up Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Upcoming Meetings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMeetings.map(meeting => (
                  <div
                    key={meeting.id}
                    className="p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{meeting.lead}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {meeting.company}
                        </p>
                      </div>
                      <Badge variant={meeting.status === 'confirmed' ? 'success' : 'warning'}>
                        {meeting.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary">{meeting.type}</Badge>
                        <span className="text-gray-600 dark:text-gray-400">{meeting.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {meeting.date} at {meeting.time}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyMeetingLink(meeting.meetingLink)}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(meeting.meetingLink, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Book */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-gray-800">
                    {meetingTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.duration})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(i)}
                          className={`p-2 text-xs rounded transition-colors ${
                            selectedDate === i
                              ? 'bg-accent-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div>
                            {date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)}
                          </div>
                          <div className="font-bold">{date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available Times</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-2 text-sm rounded transition-colors ${
                          selectedTime === slot
                            ? 'bg-accent-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="gradient"
                  className="w-full"
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleBookMeeting}
                >
                  Book Meeting
                </Button>
                {showSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Meeting booked successfully!
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarScheduler;
