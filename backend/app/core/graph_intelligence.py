"""
Graph-Based Lead Intelligence using NetworkX.
Relationship analysis, centrality scoring, community detection, and influence propagation.
"""

import logging
from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Tuple

import networkx as nx
import numpy as np

logger = logging.getLogger(__name__)


class LeadGraph:
    """
    Graph representation of lead relationships and interactions.
    Nodes: Leads, Companies, People
    Edges: Interactions, References, Company relationships
    """

    def __init__(self):
        # Directed graph for influence/referral tracking
        self.graph = nx.DiGraph()
        # Undirected for company/network relationships
        self.company_graph = nx.Graph()
        # Interaction history
        self.interaction_log: List[Dict[str, Any]] = []

    def add_lead(self, lead_id: str, attributes: Dict[str, Any]) -> None:
        """Add lead as node with attributes"""
        self.graph.add_node(lead_id, node_type="lead", **attributes)

        # Add to company graph if company specified
        company = attributes.get("company")
        if company:
            self.company_graph.add_node(company, node_type="company")
            self.company_graph.add_edge(lead_id, company, relationship="works_at")

    def add_interaction(
        self,
        source_lead: str,
        target_lead: str,
        interaction_type: str,
        weight: float = 1.0,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Add interaction between leads.
        Examples: referral, email_thread, meeting_together
        """
        if not self.graph.has_edge(source_lead, target_lead):
            self.graph.add_edge(
                source_lead,
                target_lead,
                weight=weight,
                interaction_type=interaction_type,
                count=1,
                first_interaction=datetime.now(),
                last_interaction=datetime.now(),
                metadata=metadata or {},
            )
        else:
            # Update existing edge
            edge_data = self.graph[source_lead][target_lead]
            edge_data["weight"] += weight
            edge_data["count"] += 1
            edge_data["last_interaction"] = datetime.now()

        # Log interaction
        self.interaction_log.append(
            {
                "source": source_lead,
                "target": target_lead,
                "type": interaction_type,
                "timestamp": datetime.now(),
                "metadata": metadata,
            }
        )

    def add_referral(
        self, referrer_id: str, referred_id: str, referral_value: float = 10.0
    ) -> None:
        """Add referral relationship (high-value edge)"""
        self.add_interaction(
            referrer_id,
            referred_id,
            interaction_type="referral",
            weight=referral_value,
            metadata={"is_referral": True},
        )

    def calculate_centrality_scores(self) -> Dict[str, Dict[str, float]]:
        """
        Calculate multiple centrality metrics.
        Identifies most influential/connected leads.

        Returns:
            - degree_centrality: Number of connections
            - betweenness_centrality: Bridge between communities
            - pagerank: Influence propagation
            - closeness_centrality: How close to all others
        """
        scores = {}

        # Degree centrality (normalized)
        degree_cent = nx.degree_centrality(self.graph)

        # Betweenness (identifies connectors)
        betweenness = nx.betweenness_centrality(self.graph, weight="weight")

        # PageRank (influence)
        pagerank = nx.pagerank(self.graph, weight="weight")

        # Closeness (efficiency of reaching others)
        try:
            closeness = nx.closeness_centrality(self.graph, distance="weight")
        except:
            closeness = {}

        # Combine into unified score
        for node in self.graph.nodes():
            scores[node] = {
                "degree_centrality": degree_cent.get(node, 0),
                "betweenness_centrality": betweenness.get(node, 0),
                "pagerank": pagerank.get(node, 0),
                "closeness_centrality": closeness.get(node, 0),
                # Weighted composite score
                "composite_influence_score": (
                    degree_cent.get(node, 0) * 0.2
                    + betweenness.get(node, 0) * 0.3
                    + pagerank.get(node, 0) * 0.3
                    + closeness.get(node, 0) * 0.2
                )
                * 100,
            }

        return scores

    def detect_communities(self, algorithm: str = "louvain") -> Dict[str, int]:
        """
        Detect communities/clusters in lead network.
        Useful for segmentation and targeted campaigns.

        Algorithms:
        - louvain: Fast, hierarchical
        - girvan_newman: Edge betweenness-based
        - label_propagation: Semi-supervised
        """
        # Convert to undirected for community detection
        undirected = self.graph.to_undirected()

        if algorithm == "louvain":
            # Requires python-louvain package
            try:
                import community as community_louvain

                partition = community_louvain.best_partition(undirected, weight="weight")
                return partition
            except ImportError:
                logger.warning("python-louvain not installed, using label propagation")
                algorithm = "label_propagation"

        if algorithm == "label_propagation":
            communities = nx.community.label_propagation_communities(undirected)
            # Convert to partition dict
            partition = {}
            for idx, community in enumerate(communities):
                for node in community:
                    partition[node] = idx
            return partition

        elif algorithm == "girvan_newman":
            communities = nx.community.girvan_newman(undirected)
            # Get first level
            first_level = next(communities)
            partition = {}
            for idx, community in enumerate(first_level):
                for node in community:
                    partition[node] = idx
            return partition

        return {}

    def find_influencers(self, top_n: int = 10) -> List[Tuple[str, float]]:
        """
        Find top influencers based on composite score.
        These are leads worth prioritizing for referrals.
        """
        scores = self.calculate_centrality_scores()

        # Sort by composite score
        ranked = sorted(
            scores.items(),
            key=lambda x: x[1]["composite_influence_score"],
            reverse=True,
        )

        return [(lead_id, data["composite_influence_score"]) for lead_id, data in ranked[:top_n]]

    def find_shortest_path(
        self, source: str, target: str, max_length: int = 5
    ) -> Optional[List[str]]:
        """
        Find shortest introduction path between leads.
        Useful for warm introductions.
        """
        try:
            path = nx.shortest_path(self.graph, source=source, target=target, weight="weight")

            if len(path) <= max_length:
                return path
        except nx.NetworkXNoPath:
            return None

        return None

    def get_introduction_path(
        self, rep_lead_id: str, target_lead_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Find best introduction path from rep to target.
        Returns path with relationship strength.
        """
        path = self.find_shortest_path(rep_lead_id, target_lead_id)

        if not path:
            return None

        # Calculate path strength
        path_strength = 1.0
        steps = []

        for i in range(len(path) - 1):
            source, target = path[i], path[i + 1]
            edge_data = self.graph[source][target]

            steps.append(
                {
                    "from": source,
                    "to": target,
                    "relationship": edge_data.get("interaction_type"),
                    "strength": edge_data.get("weight"),
                    "last_interaction": edge_data.get("last_interaction").isoformat(),
                }
            )

            path_strength *= edge_data.get("weight", 1.0)

        return {
            "path": path,
            "steps": steps,
            "path_length": len(path) - 1,
            "path_strength": path_strength,
            "recommendation": (
                "Strong" if path_strength > 5 else "Moderate" if path_strength > 2 else "Weak"
            ),
        }

    def propagate_influence(
        self, source_leads: List[str], iterations: int = 3, decay: float = 0.5
    ) -> Dict[str, float]:
        """
        Simulate influence propagation through network.
        Like PageRank but starting from specific seeds.

        Use case: If we convert these leads, who else becomes more valuable?
        """
        # Initialize influence scores
        influence = {node: 0.0 for node in self.graph.nodes()}

        # Set source leads to 1.0
        for source in source_leads:
            if source in influence:
                influence[source] = 1.0

        # Propagate influence
        for _ in range(iterations):
            new_influence = influence.copy()

            for node in self.graph.nodes():
                # Receive influence from neighbors
                incoming = 0.0
                for neighbor in self.graph.predecessors(node):
                    edge_weight = self.graph[neighbor][node].get("weight", 1.0)
                    incoming += influence[neighbor] * edge_weight * decay

                new_influence[node] = max(new_influence[node], incoming)

            influence = new_influence

        return influence

    def find_similar_leads(
        self, lead_id: str, top_n: int = 5, method: str = "structural"
    ) -> List[Tuple[str, float]]:
        """
        Find leads similar to given lead.

        Methods:
        - structural: Similar network position
        - attribute: Similar attributes (company, title, etc.)
        - hybrid: Combination
        """
        if method == "structural":
            return self._structural_similarity(lead_id, top_n)
        elif method == "attribute":
            return self._attribute_similarity(lead_id, top_n)
        else:
            return self._hybrid_similarity(lead_id, top_n)

    def _structural_similarity(self, lead_id: str, top_n: int) -> List[Tuple[str, float]]:
        """Structural similarity using graph metrics"""
        if lead_id not in self.graph:
            return []

        # Get node's network signature
        target_neighbors = set(self.graph.neighbors(lead_id))

        similarities = []
        for node in self.graph.nodes():
            if node == lead_id:
                continue

            node_neighbors = set(self.graph.neighbors(node))

            # Jaccard similarity of neighborhoods
            intersection = len(target_neighbors & node_neighbors)
            union = len(target_neighbors | node_neighbors)

            if union > 0:
                similarity = intersection / union
                similarities.append((node, similarity))

        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_n]

    def _attribute_similarity(self, lead_id: str, top_n: int) -> List[Tuple[str, float]]:
        """Attribute-based similarity"""
        if lead_id not in self.graph:
            return []

        target_attrs = self.graph.nodes[lead_id]

        similarities = []
        for node in self.graph.nodes():
            if node == lead_id:
                continue

            node_attrs = self.graph.nodes[node]

            # Calculate attribute similarity
            score = 0.0

            if target_attrs.get("company") == node_attrs.get("company"):
                score += 0.4

            if target_attrs.get("industry") == node_attrs.get("industry"):
                score += 0.3

            # Title similarity (simplified)
            target_title = target_attrs.get("title", "").lower()
            node_title = node_attrs.get("title", "").lower()
            if any(word in node_title for word in target_title.split()):
                score += 0.3

            if score > 0:
                similarities.append((node, score))

        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_n]

    def _hybrid_similarity(self, lead_id: str, top_n: int) -> List[Tuple[str, float]]:
        """Hybrid similarity combining structure and attributes"""
        structural = dict(self._structural_similarity(lead_id, top_n * 2))
        attribute = dict(self._attribute_similarity(lead_id, top_n * 2))

        # Combine scores
        all_nodes = set(structural.keys()) | set(attribute.keys())
        combined = []

        for node in all_nodes:
            struct_score = structural.get(node, 0) * 0.5
            attr_score = attribute.get(node, 0) * 0.5
            combined.append((node, struct_score + attr_score))

        combined.sort(key=lambda x: x[1], reverse=True)
        return combined[:top_n]

    def get_network_stats(self) -> Dict[str, Any]:
        """Get overall network statistics"""
        return {
            "total_leads": self.graph.number_of_nodes(),
            "total_relationships": self.graph.number_of_edges(),
            "network_density": nx.density(self.graph),
            "avg_clustering_coefficient": nx.average_clustering(self.graph.to_undirected()),
            "connected_components": nx.number_weakly_connected_components(self.graph),
            "diameter": self._safe_diameter(),
            "avg_path_length": self._safe_avg_path_length(),
        }

    def _safe_diameter(self) -> Optional[int]:
        """Calculate diameter if graph is connected"""
        try:
            if nx.is_weakly_connected(self.graph):
                return nx.diameter(self.graph.to_undirected())
        except:
            pass
        return None

    def _safe_avg_path_length(self) -> Optional[float]:
        """Calculate average path length if connected"""
        try:
            if nx.is_weakly_connected(self.graph):
                return nx.average_shortest_path_length(self.graph.to_undirected())
        except:
            pass
        return None

    def visualize_subgraph(self, center_node: str, depth: int = 2) -> Dict[str, Any]:
        """
        Get subgraph around node for visualization.
        Returns node/edge data for frontend rendering (D3.js, vis.js, etc.)
        """
        # BFS to get subgraph
        subgraph_nodes = set([center_node])
        current_layer = {center_node}

        for _ in range(depth):
            next_layer = set()
            for node in current_layer:
                neighbors = set(self.graph.neighbors(node)) | set(self.graph.predecessors(node))
                next_layer.update(neighbors)
            subgraph_nodes.update(next_layer)
            current_layer = next_layer

        # Build subgraph
        subgraph = self.graph.subgraph(subgraph_nodes)

        # Format for visualization
        nodes = []
        for node in subgraph.nodes():
            node_data = subgraph.nodes[node]
            nodes.append(
                {
                    "id": node,
                    "label": node_data.get("name", node),
                    "group": node_data.get("company", "unknown"),
                    "score": node_data.get("score", 50),
                    "is_center": node == center_node,
                }
            )

        edges = []
        for source, target in subgraph.edges():
            edge_data = subgraph[source][target]
            edges.append(
                {
                    "from": source,
                    "to": target,
                    "weight": edge_data.get("weight", 1),
                    "type": edge_data.get("interaction_type", "unknown"),
                }
            )

        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {"node_count": len(nodes), "edge_count": len(edges)},
        }


# Global lead graph instance
lead_graph = LeadGraph()
