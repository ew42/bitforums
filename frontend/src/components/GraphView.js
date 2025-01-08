import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GraphView.css';
import { fetchConversationPosts } from '../services/api/conversationServices';

const GraphView = ({ conversationId, onPostClick, onCreatePost }) => {
  const [posts, setPosts] = useState([]);
  const [currentTransform, setCurrentTransform] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchConversationPosts(conversationId);
        setPosts(postsData);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    
    loadPosts();
  }, [conversationId]);

  useEffect(() => {
    if (!posts || !posts.length) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const minHeight = 300;
    const heightPerPost = 100;
    const calculatedHeight = Math.max(minHeight, posts.length * heightPerPost);
    const height = Math.min(calculatedHeight, svgRef.current.clientHeight - margin.top - margin.bottom);

    // Create main SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    
    // Create a container group first
    const container = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    containerRef.current = container; // Store container reference

    // Add zoom behavior after container is created
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        setCurrentTransform(event.transform);
        containerRef.current.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Restore previous transform if it exists
    if (currentTransform) {
      svg.call(zoom.transform, currentTransform);
    }

    // Adjust scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(posts, d => new Date(d.createdAt)))
      .range([0, width]);

    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(posts, d => d.score)])
      .range([5, 25]);  // Reduced circle sizes

    // Create connections data
    const connections = [];
    posts.forEach(post => {
      if (post.parentPosts && post.parentPosts.length > 0) {
        post.parentPosts.forEach(parentId => {
          const parentPost = posts.find(p => p._id === parentId);
          if (parentPost) {
            connections.push({
              source: parentPost,
              target: post
            });
          }
        });
      }
    });

    // Create force simulation with adjusted parameters
    const simulation = d3.forceSimulation(posts)
      .force("link", d3.forceLink(connections)
        .id(d => d._id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX().x(d => xScale(new Date(d.createdAt))).strength(0.5))
      .force("y", d3.forceY().y(height / 2).strength(0.05))
      .force("collision", d3.forceCollide().radius(d => radiusScale(d.score) + 10));

    // Draw curved connections
    const links = container.selectAll("path")
      .data(connections)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5);

    // Create node groups instead of just circles
    const nodeGroups = container.selectAll("g.node")
      .data(posts)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("cursor", "pointer");

    // Add the main circle to each group
    const circles = nodeGroups.append("circle")
      .attr("r", d => radiusScale(d.score))
      .attr("fill", "#bfb6a9")
      .attr("opacity", 1)
      .attr("stroke", d => selectedPosts.includes(d._id) ? "#db5656" : null)
      .attr("stroke-width", d => selectedPosts.includes(d._id) ? 2 : 0);

    // Add text label below each circle
    nodeGroups.append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", d => radiusScale(d.score) + 15) // Position text below the circle
      .style("font-size", "12px")
      .style("fill", "#f9f1e4")
      .text(d => d.title)
      .each(function(d) {
        // Truncate long titles
        const text = d3.select(this);
        const maxLength = 20;
        let title = d.title;
        if (title.length > maxLength) {
          title = title.substring(0, maxLength) + '...';
        }
        text.text(title);
      });

    // Add plus icon to each group
    const plusIconGroups = nodeGroups.append("g")
      .attr("class", "plus-icon-group")
      .style("opacity", 0)
      .attr("transform", d => {
        const radius = radiusScale(d.score);
        // Position the plus icon at a distance that scales with the node size
        const offset = radius + 10; // Base offset from node edge
        return `translate(${offset}, 0)`;
      });

    plusIconGroups.append("circle")
      .attr("class", "plus-icon-circle")
      .attr("r", d => Math.max(8, radiusScale(d.score) * 0.4)); // Scale plus icon with node, but with a minimum size

    plusIconGroups.append("text")
      .attr("class", "plus-icon-symbol")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .style("font-size", d => `${Math.max(12, radiusScale(d.score) * 0.6)}px`) // Scale text size with node
      .text("+");

    // Handle interactions
    nodeGroups
      .on("click", (event, d) => {
        event.stopPropagation();
        onPostClick(d);
      })
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle")
          .attr("stroke", "#db5656")
          .attr("stroke-width", 2);
        
        d3.select(this).select(".plus-icon-group")
          .style("opacity", 1);
        
        svg.selectAll("path")
          .attr("opacity", path => {
            return (path.source._id === d._id || path.target._id === d._id) ? 0.8 : 0.2;
          })
          .attr("stroke", path => {
            return (path.source._id === d._id || path.target._id === d._id) ? "#db5656" : "#999";
          });
      })
      .on("mouseout", function(event, d) {
        d3.select(this).select("circle")
          .attr("stroke", selectedPosts.includes(d._id) ? "#db5656" : null)
          .attr("stroke-width", selectedPosts.includes(d._id) ? 2 : 0);
        
        d3.select(this).select(".plus-icon-group")
          .style("opacity", 0);
        
        svg.selectAll("path")
          .attr("opacity", 0.5)
          .attr("stroke", "#999");
      });

    // Add plus icon click handler
    plusIconGroups.on("click", (event, d) => {
      event.stopPropagation();
      setSelectedPosts(prev => {
        if (prev.includes(d._id)) {
          return prev.filter(id => id !== d._id);
        }
        return [...prev, d._id];
      });
    });

    // Update the simulation tick function
    simulation.on("tick", () => {
      links.attr("d", d => {
        const dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy) * 2;  // Curve strength
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      nodeGroups
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [posts, selectedPosts, onPostClick]);

  const handleCreatePost = () => {
    onCreatePost(selectedPosts, conversationId);
  };

  return (
    <div className="graph-container">
      {(!posts || posts.length === 0) ? (
        <div className="empty-graph">
          <button 
            className="create-first-post-button"
            onClick={() => onCreatePost([], conversationId)}
          >
            Create First Post
          </button>
        </div>
      ) : (
        <>
          <svg ref={svgRef} width="100%" height="100%" />
          <button 
            className="create-post-button"
            onClick={selectedPosts.length > 0 ? handleCreatePost : () => onCreatePost([], conversationId)}
          >
            {selectedPosts.length > 0 ? 'Create Connected Post' : 'Create New Post'}
          </button>
        </>
      )}
    </div>
  );
};

export default GraphView;