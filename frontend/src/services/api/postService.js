import config from '../../config';

export const toggleUpvote = async (postId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Must be logged in to upvote');
  }

  try {
    const response = await fetch(`${config.API_URL}/post/${postId}/upvote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update upvote');
    }

    return response.json();
  } catch (error) {
    console.error('Error toggling upvote:', error);
    throw error;
  }
}; 