const API_BASE_URL = 'http://localhost:80/api';

export const fetchForums = async (forumId) => {
  console.log(`Fetching forum with id: ${forumId}`);
  const url = `${API_BASE_URL}/forum/${forumId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`)
    }

    const data = await response.json();
    console.log('Fetched data:', JSON.stringify(data, null, 2));
    return data;
  }
  catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};