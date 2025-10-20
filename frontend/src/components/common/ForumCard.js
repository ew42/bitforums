import React from 'react';
import './ForumCard.css';

const ForumCard = ({pane, name, description, forumId, createNewTab}) => {
  const handleClick = () => {
    createNewTab(
      pane, 
      name,
      "forum",
      forumId
    );
  };

  return (
    <div className="forum-card" onClick={handleClick}>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ForumCard;