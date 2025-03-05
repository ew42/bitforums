import React, { useState, useEffect } from 'react';
import config from '../config';
import ForumCard from './common/ForumCard';
import './ForumBrowser.css';

const ForumBrowser = ({ pane, createNewTab}) => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending'); // trending, recent, active
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const populateForums = async () => {
      try {
        const response = await fetch(`${config.API_URL}/forum?filter=${filter}&search=${searchQuery}`);
        const data = await response.json();
        setForums(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    };
    
    populateForums();
  }, [filter, searchQuery]);

  const handleNewForum = () => {
    createNewTab(
      'central',
      'Forum Settings',
      'forum settings'
    );
  };

  return (
    <div className="forum-browser">
      <div className="forum-controls">
        <input 
          type="search" 
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="trending">Trending</option>
          <option value="recent">Recently Created</option>
          <option value="active">Most Active</option>
        </select>
        <button onClick={handleNewForum}>Create New Forum</button>
      </div>
      
      <div className="forum-list">
        {forums.map(forum => (
          <ForumCard
            pane={pane}
            name={forum.name}
            description={forum.description}
            forumId={forum._id}
            key={forum._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

export default ForumBrowser;