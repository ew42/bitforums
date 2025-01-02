import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GraphView.css';
import { fetchConversationPosts } from '../services/api/fetchConversationPosts';

const GraphView = ({ conversationId, onPostClick }) => {
  const [posts, setPosts] = useState([]);
  const [currentTransform, setCurrentTransform] = useState(null);
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

    // Create circles with full opacity
    const nodes = container.selectAll("circle")
      .data(posts)
      .enter()
      .append("circle")
      .attr("r", d => radiusScale(d.score))
      .attr("fill", "#5fadf5")
      .attr("opacity", 1)  // Full opacity
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onPostClick(d);
      })
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "#db5656")
          .attr("stroke-width", 2);
        
        svg.selectAll("path")
          .attr("opacity", path => {
            return (path.source._id === d._id || path.target._id === d._id) ? 0.8 : 0.2;
          })
          .attr("stroke", path => {
            return (path.source._id === d._id || path.target._id === d._id) ? "#db5656" : "#999";
          });
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", null);
        
        svg.selectAll("path")
          .attr("opacity", 0.5)
          .attr("stroke", "#999");
      });

    // Add tooltips
    nodes.append("title")
      .text(d => `${d.title}\nScore: ${d.score}`);

    // Update positions on each tick with curved paths
    simulation.on("tick", () => {
      links.attr("d", d => {
        const dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy) * 2;  // Curve strength
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

  }, [posts, onPostClick, currentTransform]);

  return (
    <div className="graph-container">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
};

export default GraphView;