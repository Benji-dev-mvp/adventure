import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/Toast';
import {
  Rocket,
  Bug,
  Zap,
  Shield,
  Calendar,
  Tag,
  ExternalLink
} from 'lucide-react';

const ReleaseCenter = () => {
  const { showToast } = useToast();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const response = await fetch('/api/growth/releases');
      const data = await response.json();
      setReleases(data);
    } catch (error) {
      showToast('Failed to load releases', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    feature: Rocket,
    bugfix: Bug,
    improvement: Zap,
    security: Shield
  };

  const categoryColors = {
    feature: 'bg-purple-100 text-purple-700 border-purple-300',
    bugfix: 'bg-red-100 text-red-700 border-red-300',
    improvement: 'bg-blue-100 text-blue-700 border-blue-300',
    security: 'bg-amber-100 text-amber-700 border-amber-300'
  };

  if (loading) {
    return (
      <DashboardLayout title="Release Center" subtitle="Product updates and changelog">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Release Center" subtitle="Stay updated with the latest features and improvements">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">What's New in Artisan</h2>
                <p className="text-purple-100">
                  We're constantly improving with new features, bug fixes, and enhancements
                </p>
              </div>
              <Rocket size={64} className="text-purple-200" />
            </div>
          </CardContent>
        </Card>

        {/* Releases Timeline */}
        <div className="space-y-4">
          {releases.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No releases yet</h3>
                <p className="text-gray-600">Check back soon for updates</p>
              </CardContent>
            </Card>
          ) : (
            releases.map((release) => {
              const Icon = categoryIcons[release.category] || Rocket;
              return (
                <ReleaseCard
                  key={release.id}
                  version={release.version}
                  title={release.title}
                  description={release.description}
                  category={release.category}
                  categoryColor={categoryColors[release.category]}
                  icon={<Icon size={20} />}
                  releaseDate={release.release_date}
                  isFeatured={release.is_featured}
                  tags={release.tags?.split(',') || []}
                  changelog={release.changelog_markdown}
                />
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const ReleaseCard = ({ 
  version, 
  title, 
  description, 
  category, 
  categoryColor,
  icon, 
  releaseDate, 
  isFeatured,
  tags,
  changelog 
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={isFeatured ? 'border-2 border-purple-500' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={categoryColor}>
              <span className="mr-1">{icon}</span>
              {category}
            </Badge>
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                ⭐ Featured
              </Badge>
            )}
            <Badge variant="outline">v{version}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            {new Date(releaseDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag size={10} className="mr-1" />
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}
        
        {changelog && (
          <>
            {expanded ? (
              <div className="prose prose-sm max-w-none mb-4">
                <div 
                  className="text-gray-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: changelog.replace(/\n/g, '<br>') }}
                />
              </div>
            ) : (
              <div className="text-sm text-gray-600 mb-4">
                {changelog.substring(0, 200)}...
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show Less' : 'Read More'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReleaseCenter;
