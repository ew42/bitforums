import { useState, useEffect } from 'react';
import config from '../config';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch(`${config.API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Error fetching current user:', err));
    }
  }, []);

  return currentUser;
}; 