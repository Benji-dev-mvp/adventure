import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  IntelligenceGraph,
  GraphNode,
  InfluenceMap,
  Stakeholder,
  ProactiveInsight,
  IntelligenceFilters,
} from '@/types/intelligence';

/**
 * Hook for managing intelligence graph data
 */
export function useIntelligenceGraph(filters?: IntelligenceFilters) {
  const [graph, setGraph] = useState<IntelligenceGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setIsLoading(true);
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data would be set here
        setGraph({
          nodes: [],
          edges: [],
          clusters: [],
          metadata: {
            totalNodes: 0,
            totalEdges: 0,
            lastUpdated: new Date(),
            coverageScore: 85,
            dataQuality: 92,
          },
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraph();
  }, [filters]);

  const filteredNodes = useMemo(() => {
    if (!graph || !filters) return graph?.nodes || [];
    
    return graph.nodes.filter(node => {
      if (filters.nodeTypes && !filters.nodeTypes.includes(node.type)) return false;
      if (filters.intentLevels && !filters.intentLevels.includes(node.intentLevel)) return false;
      if (filters.stages && !filters.stages.includes(node.stage)) return false;
      if (filters.minScore && node.score < filters.minScore) return false;
      return true;
    });
  }, [graph, filters]);

  const selectNode = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    // Expand node to show connected nodes
    console.log('Expanding node:', nodeId);
  }, []);

  const collapseCluster = useCallback((clusterId: string) => {
    // Collapse a cluster of nodes
    console.log('Collapsing cluster:', clusterId);
  }, []);

  return {
    graph,
    filteredNodes,
    isLoading,
    error,
    selectedNode,
    selectNode,
    expandNode,
    collapseCluster,
  };
}

/**
 * Hook for managing influence maps
 */
export function useInfluenceMap(accountId: string) {
  const [map, setMap] = useState<InfluenceMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  useEffect(() => {
    const fetchMap = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data would be set here
      setMap({
        accountId,
        accountName: 'Sample Account',
        stakeholders: [],
        relationships: [],
        buyingCenter: {
          missingRoles: [],
          blockers: [],
        },
        recommendations: [],
        lastUpdated: new Date(),
      });
      
      setIsLoading(false);
    };

    if (accountId) {
      fetchMap();
    }
  }, [accountId]);

  const selectStakeholder = useCallback((stakeholder: Stakeholder | null) => {
    setSelectedStakeholder(stakeholder);
  }, []);

  const updateStakeholderRole = useCallback((stakeholderId: string, role: string) => {
    setMap(prev => {
      if (!prev) return null;
      return {
        ...prev,
        stakeholders: prev.stakeholders.map(s =>
          s.id === stakeholderId ? { ...s, role: role as any } : s
        ),
      };
    });
  }, []);

  const addRelationship = useCallback((fromId: string, toId: string, type: string) => {
    // Add new relationship
    console.log('Adding relationship:', fromId, toId, type);
  }, []);

  return {
    map,
    isLoading,
    selectedStakeholder,
    selectStakeholder,
    updateStakeholderRole,
    addRelationship,
  };
}

/**
 * Hook for proactive insights
 */
export function useProactiveInsights() {
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock insights
      setInsights([
        {
          id: 'ins-1',
          type: 'opportunity',
          priority: 'high',
          title: 'High-intent account detected',
          description: 'Acme Corp showing buying signals',
          evidence: [],
          suggestedActions: [],
          affectedEntities: ['acc-1'],
          createdAt: new Date(),
          isActioned: false,
        },
      ]);
      setUnreadCount(3);
      setIsLoading(false);
    };

    fetchInsights();
  }, []);

  const markAsActioned = useCallback((insightId: string) => {
    setInsights(prev =>
      prev.map(i => i.id === insightId ? { ...i, isActioned: true } : i)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev =>
      prev.map(i => i.id === insightId ? { ...i, dismissedAt: new Date() } : i)
    );
  }, []);

  return {
    insights,
    unreadCount,
    isLoading,
    markAsActioned,
    dismissInsight,
  };
}

/**
 * Hook for intelligence search
 */
export function useIntelligenceSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock search results
    setResults([]);
    setIsSearching(false);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    results,
    isSearching,
    search,
    clearSearch,
  };
}

export default {
  useIntelligenceGraph,
  useInfluenceMap,
  useProactiveInsights,
  useIntelligenceSearch,
};
