import config from '../../config';

export const fetchPosts = async (postId) => {
  console.log('Fetching post with id:', postId);
  const url = `${config.API_URL}/post/${postId}`;
  console.log('URL:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  }
  catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};
