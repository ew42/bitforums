import config from '../../config';

export const savePost = async (postData) => {
  console.log("Saving post with data:", postData);
  const url = `${config.API_URL}/post`;
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try { 
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error(`Error, status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log("Error creating post");
    throw error;
  }
};