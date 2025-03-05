import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../services/api/fetchPosts';
import { toggleUpvote } from '../services/api/postService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './Viewer.css';

const Viewer = ({ title="test", postId, createNewTab}) => {
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleProfileClick = () => {
    console.log('postdata:', postData)
    createNewTab(
      "central",
      postData.author.username,
      "profile",
      postData.author._id,
      {userId: postData.author._id, username: postData.author.username}
    )
  };

  const handleUpvote = async () => {
    try {
      const result = await toggleUpvote(postId);
      setPostData(prev => ({
        ...prev,
        score: result.score
      }));
      setHasUpvoted(result.hasUpvoted);
    } catch (error) {
      if (error.message === 'Must be logged in to upvote') {
        createNewTab("central", "Login", "login");
      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadPostData() {
      if (!postId) {
        setError("No post ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchPosts(postId);
        if (isMounted) {
          setPostData(data);
          const token = localStorage.getItem('authToken');
          if (token) {
            const userId = JSON.parse(atob(token.split('.')[1])).userId;
            setHasUpvoted(data.upvotedBy?.some(voter => voter._id === userId));
          } else {
            setHasUpvoted(false);
          }
          setError(null);
        }
      }
      catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
      finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPostData();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  return (
    <div className="viewer">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : postData ? (
        <div>
          <div className="viewer-title">
            <h2><strong>{postData.title}</strong></h2>
            <p className="author-tag" onClick={handleProfileClick}>
              by <em>{postData.author.username}</em> | on {new Date(postData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className="markdown-content"
          >
            {postData.content}
          </ReactMarkdown>
          <button 
            className={`upvote-button ${hasUpvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
          >
            ▲ {postData?.score || 0}
          </button>
        </div>
      ) : (
        <p>No post data available</p>
      )}
    </div>
  );
};

export default Viewer;