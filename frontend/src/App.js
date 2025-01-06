import './App.css';
import './styles/global.css';
import RootContainer from './components/RootContainer.js';
import NavBar from './components/NavBar.js';
import useTabData from './hooks/useTabData.js';
import { useState, useEffect } from 'react';
import { validateToken } from './services/api/validateToken.js';

function App() {
  const {tabs, panes, togglePane, selectTab, closeTab, createNewTab} = useTabData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const validateAuth = async () => {
      const userData = await validateToken();
      console.log('validateToken response:', userData);
      if (userData) {
        setIsLoggedIn(true);
        setUsername(userData.username);
        setUserId(userData.id);
      }
      else {
        setIsLoggedIn(false);
        setUsername('');
        setUserId('');
      }
    }
    validateAuth();
  }, []);

  console.log('username =', username);
  console.log('userId =', userId);

  return (
    <div className="App">
      <NavBar tabs={tabs} createNewTab={createNewTab} selectTab={selectTab} isLoggedIn={isLoggedIn} userData={{ username, userId }} />
      <RootContainer tabs={tabs} panes={panes} togglePane={togglePane} selectTab={selectTab} closeTab={closeTab} createNewTab={createNewTab} />
    </div>
  );
}

export default App;
