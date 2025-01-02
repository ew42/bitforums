import config from '../../config';

export const validateToken = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const response = await fetch(`${config.API_URL}/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      return false;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Token validation failed:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    return false;
  }
};
