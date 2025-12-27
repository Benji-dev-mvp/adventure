import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/Toast';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Sparkles,
  FileText,
  Target,
  MessageSquare,
  HelpCircle,
  Filter
} from 'lucide-react';

const KnowledgeFusion = () => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [filterType]);

  const fetchDocuments = async () => {
    try {
      const url = filterType === 'all' 
        ? '/api/strategic/knowledge'
        : `/api/strategic/knowledge?doc_type=${filterType}`;
      const response = await fetch(url);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      showToast('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (formData) => {
    try {
      const response = await fetch('/api/strategic/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('Document created successfully', 'success');
        fetchDocuments();
        setShowCreateModal(false);
      }
    } catch (error) {
      showToast('Failed to create document', 'error');
    }
  };

  const handleGenerateFromCall = async (transcript) => {
    try {
      const response = await fetch('/api/strategic/knowledge/generate-from-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ call_transcript: transcript, doc_type: 'battle_card' })
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`Document generated with ${(data.ai_confidence * 100).toFixed(0)}% confidence`, 'success');
        fetchDocuments();
        setShowGenerateModal(false);
      }
    } catch (error) {
      showToast('Failed to generate document', 'error');
    }
  };

  const docTypeIcons = {
    battle_card: Target,
    playbook: BookOpen,
    objection_handler: MessageSquare,
    faq: HelpCircle
  };

  const docTypeColors = {
    battle_card: 'bg-blue-100 text-blue-700',
    playbook: 'bg-purple-100 text-purple-700',
    objection_handler: 'bg-amber-100 text-amber-700',
    faq: 'bg-green-100 text-green-700'
  };

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout 
      title="Knowledge Fusion" 
      subtitle="AI-generated documentation from calls and emails"
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
            <Sparkles size={16} />
            Generate from Call
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Create Document
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatsCard
            icon={<Target />}
            label="Battle Cards"
            value={documents.filter(d => d.doc_type === 'battle_card').length}
            color="blue"
          />
          <StatsCard
            icon={<BookOpen />}
            label="Playbooks"
            value={documents.filter(d => d.doc_type === 'playbook').length}
            color="purple"
          />
          <StatsCard
            icon={<MessageSquare />}
            label="Objection Handlers"
            value={documents.filter(d => d.doc_type === 'objection_handler').length}
            color="amber"
          />
          <StatsCard
            icon={<Sparkles />}
            label="AI Generated"
            value={documents.filter(d => d.ai_generated).length}
            color="green"
          />
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <FilterButton
                  active={filterType === 'all'}
                  onClick={() => setFilterType('all')}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={filterType === 'battle_card'}
                  onClick={() => setFilterType('battle_card')}
                >
                  Battle Cards
                </FilterButton>
                <FilterButton
                  active={filterType === 'playbook'}
                  onClick={() => setFilterType('playbook')}
                >
                  Playbooks
                </FilterButton>
                <FilterButton
                  active={filterType === 'objection_handler'}
                  onClick={() => setFilterType('objection_handler')}
                >
                  Objections
                </FilterButton>
                <FilterButton
                  active={filterType === 'faq'}
                  onClick={() => setFilterType('faq')}
                >
                  FAQs
                </FilterButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const Icon = docTypeIcons[doc.doc_type] || FileText;
            return (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={docTypeColors[doc.doc_type]}>
                      <Icon size={14} className="mr-1" />
                      {doc.doc_type.replace('_', ' ')}
                    </Badge>
                    {doc.ai_generated && (
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        <Sparkles size={12} className="mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                  <CardDescription>
                    {doc.content.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{doc.view_count || 0}</span>
                      </div>
                      <span>
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search' : 'Create your first knowledge document'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create Document
            </Button>
          </div>
        )}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <CreateDocumentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDocument}
        />
      )}

      {/* Generate from Call Modal */}
      {showGenerateModal && (
        <GenerateFromCallModal
          onClose={() => setShowGenerateModal(false)}
          onSubmit={handleGenerateFromCall}
        />
      )}

      {/* View Document Modal */}
      {selectedDoc && (
        <ViewDocumentModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </DashboardLayout>
  );
};

const StatsCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`inline-flex p-2 rounded-lg mb-3 ${colorClasses[color]}`}>
          {icon}
        </div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
  >
    {children}
  </Button>
);

const CreateDocumentModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    doc_type: 'battle_card'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal onClose={onClose} title="Create Knowledge Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={formData.doc_type}
            onChange={(e) => setFormData({ ...formData, doc_type: e.target.value })}
          >
            <option value="battle_card">Battle Card</option>
            <option value="playbook">Playbook</option>
            <option value="objection_handler">Objection Handler</option>
            <option value="faq">FAQ</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Document</Button>
        </div>
      </form>
    </Modal>
  );
};

const GenerateFromCallModal = ({ onClose, onSubmit }) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(transcript);
  };

  return (
    <Modal onClose={onClose} title="Generate from Call Transcript">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Transcript
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={12}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your call transcript here..."
            required
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <Sparkles size={16} className="inline mr-1" />
            AI will analyze the transcript and extract key information to create a battle card automatically.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Sparkles size={16} />
            Generate
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ViewDocumentModal = ({ document, onClose }) => {
  const Icon = {
    battle_card: Target,
    playbook: BookOpen,
    objection_handler: MessageSquare,
    faq: HelpCircle
  }[document.doc_type] || FileText;

  return (
    <Modal onClose={onClose} title={document.title} size="large">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={
            document.doc_type === 'battle_card' ? 'bg-blue-100 text-blue-700' :
            document.doc_type === 'playbook' ? 'bg-purple-100 text-purple-700' :
            document.doc_type === 'objection_handler' ? 'bg-amber-100 text-amber-700' :
            'bg-green-100 text-green-700'
          }>
            <Icon size={14} className="mr-1" />
            {document.doc_type.replace('_', ' ')}
          </Badge>
          {document.ai_generated && (
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Sparkles size={12} className="mr-1" />
              AI Generated ({(document.confidence_score * 100).toFixed(0)}% confidence)
            </Badge>
          )}
        </div>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">{document.content}</div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
          <div>
            Created: {new Date(document.created_at).toLocaleDateString()}
          </div>
          <div>
            Views: {document.view_count || 0}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default KnowledgeFusion;
