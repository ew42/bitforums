import React from 'react';
import './PostCard.css';

const PostCard = ({ title, author, createdAt, postId, postConversation, createNewTab }) => {
  const handleClick = () => {
    createNewTab(
      "central",
      title,
      "viewer",
      postId
    );
  };

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="post-card" onClick={handleClick}>
      <h3><strong>{title}</strong></h3>
      <div className="post-metadata">
        <span className="author">By {author} | </span>
        <span className="date">on {formattedDate} </span>
      </div>
    </div>
  );
};

export default PostCard;