import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';
import {
  Type,
  Image,
  Link,
  AlignLeft,
  AlignCenter,
  Save,
  Eye,
  Copy,
  Trash2,
  Plus,
  GripVertical,
} from 'lucide-react';

const EmailTemplateBuilder = () => {
  const [templateName, setTemplateName] = useState('New Template');
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'header', content: 'Welcome to {{company}}!' },
    {
      id: 2,
      type: 'body',
      content: 'Hi {{firstName}},\n\nThanks for your interest in our services.',
    },
    { id: 3, type: 'cta', content: 'Book a Demo', link: 'https://example.com/demo' },
    { id: 4, type: 'footer', content: '© 2025 Artisan AI. All rights reserved.' },
  ]);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showVariables, setShowVariables] = useState(false);

  const blockTypes = [
    { type: 'header', icon: Type, label: 'Header', color: 'bg-blue-100 text-blue-600' },
    { type: 'body', icon: AlignLeft, label: 'Body Text', color: 'bg-green-100 text-green-600' },
    { type: 'cta', icon: Link, label: 'Call-to-Action', color: 'bg-purple-100 text-purple-600' },
    { type: 'image', icon: Image, label: 'Image', color: 'bg-orange-100 text-orange-600' },
    { type: 'footer', icon: AlignCenter, label: 'Footer', color: 'bg-gray-100 text-gray-600' },
  ];

  const variables = [
    '{{firstName}}',
    '{{lastName}}',
    '{{company}}',
    '{{title}}',
    '{{industry}}',
    '{{email}}',
  ];

  const templates = [
    { id: 1, name: 'Cold Outreach', blocks: 4, lastEdited: '2 days ago' },
    { id: 2, name: 'Follow-up Email', blocks: 3, lastEdited: '1 week ago' },
    { id: 3, name: 'Meeting Reminder', blocks: 3, lastEdited: '2 weeks ago' },
  ];

  const addBlock = type => {
    const newBlock = {
      id: Date.now(),
      type,
      content: type === 'cta' ? 'Click Here' : 'New content...',
      link: type === 'cta' ? 'https://example.com' : '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const deleteBlock = id => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < blocks.length - 1)) {
      const newBlocks = [...blocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const renderPreview = () => {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm max-w-2xl mx-auto">
        {blocks.map(block => {
          switch (block.type) {
            case 'header':
              return (
                <h1 key={block.id} className="text-lg font-bold text-gray-900 mb-6">
                  {block.content}
                </h1>
              );
            case 'body':
              return (
                <p key={block.id} className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {block.content}
                </p>
              );
            case 'cta':
              return (
                <div key={block.id} className="my-6">
                  <a
                    href={block.link}
                    className="inline-block bg-accent-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors"
                  >
                    {block.content}
                  </a>
                </div>
              );
            case 'footer':
              return (
                <div
                  key={block.id}
                  className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200"
                >
                  {block.content}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Email Template Builder"
      subtitle="Create reusable email templates with drag-and-drop blocks"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Input
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="text-lg font-semibold border-none p-0 focus:ring-0"
                  />
                  <CardDescription>Drag blocks to reorder, click to edit</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Email Preview</DialogTitle>
                        <DialogDescription>
                          How your email will appear to recipients
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[600px] overflow-y-auto">{renderPreview()}</div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="gradient">
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedBlock === block.id
                      ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10'
                      : 'border-gray-200 dark:border-white/10'
                  }`}
                  onClick={() => setSelectedBlock(block.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          moveBlock(block.id, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {block.type}
                        </Badge>
                      </div>

                      {block.type === 'header' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={e => updateBlock(block.id, 'content', e.target.value)}
                          className="w-full text-lg font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white"
                          onClick={e => e.stopPropagation()}
                        />
                      )}

                      {block.type === 'body' && (
                        <textarea
                          value={block.content}
                          onChange={e => updateBlock(block.id, 'content', e.target.value)}
                          rows={3}
                          className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 resize-none"
                          onClick={e => e.stopPropagation()}
                        />
                      )}

                      {block.type === 'cta' && (
                        <div className="space-y-2" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={block.content}
                            onChange={e => updateBlock(block.id, 'content', e.target.value)}
                            placeholder="Button text"
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg"
                          />
                          <input
                            type="text"
                            value={block.link}
                            onChange={e => updateBlock(block.id, 'link', e.target.value)}
                            placeholder="Button link"
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg"
                          />
                        </div>
                      )}

                      {block.type === 'footer' && (
                        <input
                          type="text"
                          value={block.content}
                          onChange={e => updateBlock(block.id, 'content', e.target.value)}
                          className="w-full text-sm bg-transparent border-none outline-none text-gray-500"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteBlock(block.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
                {blockTypes.map(blockType => {
                  const Icon = blockType.icon;
                  return (
                    <Button
                      key={blockType.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(blockType.type)}
                      className="gap-2"
                    >
                      <Plus className="w-3 h-3" />
                      {blockType.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variables</CardTitle>
              <CardDescription>Click to copy to clipboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {variables.map(variable => (
                  <button
                    key={variable}
                    onClick={() => {
                      navigator.clipboard.writeText(variable);
                      alert(`Copied ${variable}`);
                    }}
                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-mono hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Templates</CardTitle>
              <CardDescription>Load a template to start editing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-3 border border-gray-200 dark:border-white/10 rounded-lg hover:border-accent-500 dark:hover:border-accent-500 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    <Copy className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.blocks} blocks</span>
                    <span>{template.lastEdited}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-accent-500/10 to-purple-500/10 border-accent-500/20">
            <CardHeader>
              <CardTitle className="text-base">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>• Use variables for personalization</p>
              <p>• Keep subject lines under 50 characters</p>
              <p>• Include a clear call-to-action</p>
              <p>• Test on mobile devices</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmailTemplateBuilder;
