import React, { useState } from 'react';
import { createNewForum } from "../services/api/forumService";
import './ForumSettings.css';

const ForumSettings = ({ createNewTab }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await createNewForum({
        name,
        description
      });

      setIsSuccess(true);
      
      // Open the new forum view
      createNewTab(
        "left",
        name,
        "forum",
        response._id
      );
    }
    catch (error) {
      setError(error.message || 'Failed to create forum. Please try again.');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='forum-settings success'>
        <h2>Forum Created Successfully!</h2>
        <p>Your new forum "{name}" has been created.</p>
      </div>
    );
  }

  return (
    <div className='forum-settings'>
      <h1>Create new forum</h1>
      {error && <div className="error-message">{error}</div>}
      <input 
        type='text' 
        value={name} 
        placeholder='Forum Name' 
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <input 
        type='text' 
        value={description} 
        placeholder='Description' 
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <button 
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Forum'}
      </button>
    </div>
  );
};

export default ForumSettings;