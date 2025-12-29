import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Mail,
  Linkedin,
  Phone,
  Building2,
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { PageScaffold } from '../components/layout/OperatorShell';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { useToast } from '../components/Toast';
import { InlineLoader, PageLoader } from '../components/Loading';
import {
  updateLeadStatus,
  exportLeads,
  addLeadActivity,
  getLeads,
  getActiveCRM,
} from '../lib/dataService';
import { cn } from '../lib/utils';

const getStatusBadge = status => {
  switch (status) {
    case 'hot':
      return { label: 'Hot', variant: 'danger' };
    case 'warm':
      return { label: 'Warm', variant: 'warning' };
    case 'cold':
      return { label: 'Cold', variant: 'default' };
    default:
      return { label: 'New', variant: 'primary' };
  }
};

const getScoreColor = score => {
  if (score >= 90) return 'from-red-500 to-orange-500';
  if (score >= 75) return 'from-amber-400 to-yellow-500';
  return 'from-blue-400 to-indigo-500';
};

const Leads = () => {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const activeCRM = getActiveCRM();

  useEffect(() => {
    setIsLoading(true);
    const data = getLeads();
    setLeads(data);
    setSelectedLeadId(data[0]?.id ?? null);
    setIsLoading(false);
  }, []);

  const selectedLead = useMemo(
    () => leads.find(lead => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter(lead => {
      const matchesStatus =
        filterStatus === 'all'
          ? true
          : filterStatus === 'verified'
            ? Boolean(lead.verified)
            : filterStatus === 'replied'
              ? lead.activity?.some(activity => activity.type === 'email_replied')
              : lead.status === filterStatus;

      const matchesSearch =
        !query ||
        [lead.name, lead.company, lead.title, lead.email, lead.location, lead.industry]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, leads, searchQuery]);

  const handleStatusChange = (leadId, status) => {
    const updatedLeads = updateLeadStatus(leadId, status);
    setLeads(updatedLeads);
    const badge = getStatusBadge(status);
    toast.success(`Marked lead as ${badge.label}`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const url = exportLeads();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'leads.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Exported leads to JSON');
    } catch (error) {
      toast.error('Could not export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEngageLead = leadId => {
    const nextActivity = {
      type: 'email_sent',
      message: 'Sent quick follow-up via Ava',
      time: 'Just now',
    };

    const updatedLead = addLeadActivity(leadId, nextActivity);
    setLeads(prev => prev.map(lead => (lead.id === leadId ? updatedLead : lead)));
    toast.info('Logged new activity');
  };

  if (isLoading) {
    return <PageLoader message="Loading leads..." />;
  }

  return (
    <PageScaffold
      config={{
        title: 'Leads',
        subtitle: 'All leads found by Ava and uploaded by your team',
        badges: [{ label: 'CRM', color: 'green' }],
        showInspector: true,
      }}
    >
      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">
                    1202 total leads • intent enriched and scored
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>Hot &gt;92</span>
                    <span>Warm 75-91</span>
                    <span>Cold {'<'}75</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? <InlineLoader size="sm" /> : <Download size={18} />}
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                  <Button className="gap-2" onClick={() => setIsContactOpen(true)}>
                    View Profile
                  </Button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, company, or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2 w-full lg:w-auto">
                  <Filter size={18} />
                  Filters
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Leads' },
                  { key: 'verified', label: 'Verified', variant: 'success' },
                  { key: 'hot', label: 'Hot (92+)', variant: 'danger' },
                  { key: 'warm', label: 'Warm (75-91)', variant: 'warning' },
                  { key: 'cold', label: 'Cold (<75)', variant: 'default' },
                  { key: 'replied', label: 'Replied', variant: 'success' },
                ].map(filter => (
                  <Badge
                    key={filter.key}
                    variant={filter.variant || 'default'}
                    className={cn(
                      'cursor-pointer px-3 py-1.5 rounded-full',
                      filterStatus === filter.key && 'ring-2 ring-accent-200'
                    )}
                    onClick={() => setFilterStatus(filter.key)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredLeads.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No leads match your filters.
                  </div>
                )}

                {filteredLeads.map(lead => {
                  const statusBadge = getStatusBadge(lead.status);
                  const isSelected = selectedLead?.id === lead.id;
                  const scoreWidth = Math.min(lead.score, 100);

                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={cn(
                        'w-full text-left px-4 py-3 flex items-center gap-4 transition-all',
                        'hover:bg-accent-50/60',
                        isSelected ? 'bg-accent-50/80 border-l-4 border-accent-400' : 'bg-white'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg">
                            {lead.avatar}
                          </div>
                          {isSelected && (
                            <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-accent-500 border-2 border-white" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{lead.name}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {lead.title} • {lead.company}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                          {lead.source && (
                            <div className="mt-1">
                              <Badge
                                variant="default"
                                className="bg-white border border-gray-200 text-xs"
                              >
                                Source: {lead.source}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Building2 size={16} className="text-gray-400" />
                          <span>{lead.industry}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{lead.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          {lead.verified && (
                            <div className="flex items-center gap-1 text-xs text-green-700">
                              <CheckCircle2 size={14} className="text-green-600" />
                              Verified
                            </div>
                          )}
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{ width: `${scoreWidth}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={e => {
                              e.stopPropagation();
                              handleEngageLead(lead.id);
                            }}
                            title="Send email"
                          >
                            <Mail size={16} className="text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone size={16} className="text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={e => {
                              e.stopPropagation();
                              handleStatusChange(lead.id, lead.status === 'hot' ? 'warm' : 'hot');
                            }}
                            title={lead.status === 'hot' ? 'Mark Warm' : 'Mark Hot'}
                          >
                            <Star
                              size={16}
                              className={
                                lead.status === 'hot' ? 'text-yellow-500' : 'text-gray-600'
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="shadow-lg border-accent-100">
            <CardContent className="space-y-3">
              {!selectedLead && (
                <div className="text-center text-sm text-gray-500 py-6">
                  Select a lead to view details.
                </div>
              )}

              {selectedLead && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg">
                      {selectedLead.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedLead.name}</h3>
                          <p className="text-sm text-gray-600">
                            {selectedLead.title} at {selectedLead.company}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{selectedLead.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusBadge(selectedLead.status).variant}>
                            {getStatusBadge(selectedLead.status).label}
                          </Badge>
                          <Badge
                            variant="score"
                            className={`bg-gradient-to-r ${getScoreColor(selectedLead.score)}`}
                          >
                            Score {selectedLead.score}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
                        <Badge variant="default">Intent: {selectedLead.industry}</Badge>
                        <Badge variant="default">Last contact: {selectedLead.lastContact}</Badge>
                        {selectedLead.verified && (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 size={12} /> Verified
                          </Badge>
                        )}
                        {selectedLead.source && (
                          <Badge variant="default">Source: {selectedLead.source}</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-accent-600 font-medium flex items-center gap-1"
                      >
                        {selectedLead.email}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <span className="text-gray-800 font-medium">{selectedLead.phone}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                      <a
                        href={`https://${selectedLead.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-600 font-medium flex items-center gap-1"
                      >
                        Profile
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Company Size</p>
                      <span className="text-gray-800 font-medium">
                        {selectedLead.enrichment.companySize}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Revenue</p>
                      <span className="text-gray-800 font-medium">
                        {selectedLead.enrichment.revenue}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Recent News</p>
                      <span className="text-gray-800">{selectedLead.enrichment.recentNews}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-white border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Verification</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedLead.verified ? (
                          <>
                            <CheckCircle2 size={16} className="text-green-600" />
                            <span className="text-sm text-gray-800">Verified</span>
                          </>
                        ) : (
                          <>
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="text-sm text-gray-800">Unverified</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Source:{' '}
                        <span className="font-medium text-gray-900">
                          {selectedLead.source || activeCRM || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    {!selectedLead.verified && (
                      <div className="mt-2 text-xs text-gray-500">
                        Connect a trusted source to verify this lead.{' '}
                        <a href="/integrations" className="text-accent-600 hover:underline">
                          View integrations
                        </a>
                        .
                      </div>
                    )}

                    {/* Edit controls */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedLead.verified)}
                          onChange={e =>
                            setLeads(prev =>
                              prev.map(l =>
                                l.id === selectedLead.id ? { ...l, verified: e.target.checked } : l
                              )
                            )
                          }
                        />
                        Mark as verified
                      </label>
                      <div>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          value={selectedLead.source || ''}
                          onChange={e =>
                            setLeads(prev =>
                              prev.map(l =>
                                l.id === selectedLead.id ? { ...l, source: e.target.value } : l
                              )
                            )
                          }
                          placeholder="Source (e.g., Postgres, Salesforce)"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() => {
                            const updated = updateLeadVerification(selectedLead.id, {
                              verified: selectedLead.verified,
                              source: selectedLead.source,
                            });
                            setLeads(prev => prev.map(l => (l.id === updated.id ? updated : l)));
                            toast.success('Verification updated');
                          }}
                        >
                          Save Verification
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.enrichment.techStack.map(tech => (
                        <Badge
                          key={tech}
                          variant="default"
                          className="bg-white border border-gray-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Activity</h4>
                    <div className="space-y-3">
                      {selectedLead.activity.map((activity, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center">
                            {activity.type === 'email_opened' && (
                              <Mail size={16} className="text-accent-600" />
                            )}
                            {activity.type === 'email_sent' && (
                              <Mail size={16} className="text-gray-600" />
                            )}
                            {activity.type === 'email_replied' && (
                              <Mail size={16} className="text-green-600" />
                            )}
                            {activity.type === 'link_clicked' && (
                              <TrendingUp size={16} className="text-blue-600" />
                            )}
                            {activity.type === 'meeting_booked' && (
                              <Calendar size={16} className="text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button className="gap-2">
                      <Mail size={16} /> Respond
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleEngageLead(selectedLead.id)}
                    >
                      <Phone size={16} /> Call
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() =>
                        handleStatusChange(
                          selectedLead.id,
                          selectedLead.status === 'hot' ? 'warm' : 'hot'
                        )
                      }
                    >
                      <Star size={16} /> {selectedLead.status === 'hot' ? 'Mark Warm' : 'Mark Hot'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isContactOpen && !!selectedLead}
        onClose={() => setIsContactOpen(false)}
        size="lg"
      >
        {selectedLead && (
          <>
            <ModalHeader onClose={() => setIsContactOpen(false)}>
              <ModalTitle>Contact {selectedLead.name}</ModalTitle>
            </ModalHeader>

            <ModalContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-gray-400" />
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-accent-600 hover:underline"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-700">{selectedLead.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin size={16} className="text-gray-400" />
                      <a
                        href={`https://${selectedLead.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-600 hover:underline flex items-center gap-1"
                      >
                        LinkedIn Profile
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-700">{selectedLead.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Company Insights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Company Size</p>
                      <p className="font-medium text-gray-900">
                        {selectedLead.enrichment.companySize}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Revenue</p>
                      <p className="font-medium text-gray-900">{selectedLead.enrichment.revenue}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-accent-50 rounded-lg">
                    <p className="text-xs text-accent-700 font-medium mb-2">Recent News</p>
                    <p className="text-sm text-gray-700">{selectedLead.enrichment.recentNews}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.enrichment.techStack.map(tech => (
                        <Badge key={tech} variant="default">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>

            <ModalFooter>
              <Button variant="outline" onClick={() => setIsContactOpen(false)}>
                Close
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail size={16} />
                Send Email
              </Button>
              <Button className="gap-2" onClick={() => handleEngageLead(selectedLead.id)}>
                <Calendar size={16} />
                Book Meeting
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </PageScaffold>
  );
};

export default Leads;
