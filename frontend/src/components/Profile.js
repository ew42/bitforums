import React, { useState, useEffect } from 'react';
import { fetchUserPosts } from '../services/api/fetchUserPosts';
import PostCard from './common/PostCard';
import './Profile.css';

const Profile = ({ userdata, createNewTab }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    forum: '',
    conversation: '',
    search: ''
  });

  const handleFetchUserPosts = async () => {
    if (!userdata?.userId) {
      console.error('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchUserPosts(userdata.userId, filters);
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userdata?.userId) {
      handleFetchUserPosts();
    }
  }, [userdata?.userId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userdata?.userId) {
    return <div>No user data available</div>;
  }

  return (
    <div className="profile-container">
      <h1>{userdata?.username}'s Posts</h1>
      
      <div className="filter-controls">
        <input
          type="text"
          name="forum"
          placeholder="Filter by forum..."
          value={filters.forum}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="conversation"
          placeholder="Filter by conversation..."
          value={filters.conversation}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="search"
          name="search"
          placeholder="Search posts..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard
              key={post._id}
              title={post.title}
              author={post.author.username}
              createdAt={post.createdAt}
              postId={post._id}
              postConversation={post.conversation?.title || 'No conversation'}
              createNewTab={createNewTab}
            />
          ))}
        </div>
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
};

export default Profile;