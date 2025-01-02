import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/api/registerUser';
import { loginUser } from "../services/api/loginUser";
import { fetchForum, fetchForums } from "../services/api/fetchForums"
import { fetchPosts } from "../services/api/fetchPosts"
import "./RootContainer.css";
import "./GraphView";
import { fetchConversationPosts } from '../services/api/fetchConversationPosts';
import GraphView from './GraphView';

const API_BASE_URL = 'http://localhost:80/api';

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

const Tab = ({ pane, tab, tabIndex, closeTab, selectTab}) => {
  return (
  <div className="tab">
      <button className="tab-button" onClick={() => selectTab(pane, tabIndex)}>{tab.title}</button>
      <button className="x-button" onClick={() => closeTab(pane, tabIndex)}>X</button>
  </div>
)};

const PaneControlPanel = ({ tabStates, paneStates, togglePanes, closeTab, createNewTab, selectTab }) => {

  return (
    <div className="pane-control-panel">
      <div className="left-pane-div">
        {tabStates.left?.map((tab, arrayIndex) => <Tab key={
          `left-tab-${arrayIndex}`} pane="left" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
        <button className="left-add" onClick={() => {createNewTab("left")}}>+</button>
        <button className="left-toggle" onClick={() => {togglePanes("left")}}>Left Pane</button>
      </div>
      <div className="central-pane-div">
        {tabStates.central?.map((tab, arrayIndex) => <Tab key={
          `central-tab-${arrayIndex}`} pane="central" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
        <button className="central-add" onClick={() => {createNewTab("central")}}>+</button>
      </div>
        <div className="right-pane-div">
          {tabStates.right?.map((tab, arrayIndex) => <Tab key={
          `right-tab-${arrayIndex}`} pane="right" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
          <button className="right-add" onClick={() => {createNewTab("right")}}>+</button>
          <button className="right-toggle" onClick={() => {togglePanes("right")}}>Right Pane</button>
      </div>
    </div>
)};

const Pane = ({ title="test", type="viewer", id, pane, createNewTab }) => {
  const renderContent = () => {
    switch (type) {
      case "viewer":
        console.log("Generating viewer component");
        return <Viewer title={title} postId={id}/>;
      case "forum":
        return <Forum title={title} forumId={id} createNewTab={createNewTab}/>;
      case "register":
        return <Register />;
      case "login":
        console.log("Generating login component");
        return <Login />;
      case "forum browser":
        return <ForumBrowser pane={pane} createNewTab={createNewTab} />;
      case "graph view":
        return <GraphView
          conversationId={id}
          onPostClick={(post) => {
            createNewTab(
              "central",
              post.title,
              "viewer",
              post._id
            )
          }}
        />
    }
  };

  return (
    <div className="pane">
      {renderContent()}
    </div>
  );
};

const Viewer = ({ title="test", postId}) => {
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPostData() {
      if (!postId) {
        setError("No post ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchPosts(postId);
        if (isMounted) {
          setPostData(data);
          setError(null);
        }
      }
      catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
      finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPostData();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!postData) {
    return <div>No post data available</div>;
  }

  return (
    <div className="viewer">
      <h1>{postData.title}</h1>
      <p>{postData.content}</p>
    </div>
  );
};

const Forum = ({ title="Forum", forumId, createNewTab}) => {
  const [forumData, setForumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    let isMounted = true;

    async function loadForumData() {
      console.log(forumId);
      if (!forumId) {
        setError("No forum ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchForum(forumId);
        console.log("data populated");
        setForumData(data);
        setError(null);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    loadForumData(forumId);
    return () => {
      isMounted = false;
    };
  }, [forumId]);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }
  if (!forumData) {
    return (
      <div>No forum data available</div>
    );
  }

  return (
    <div className="forum-data">
      <h1>{forumData.name}</h1>
      <p>{forumData.description}</p>
      <h2>Conversations:</h2>
      <div className="conversation-list">
        {forumData.conversations.map(conversation => (
          <ConversationCard
            key={conversation._id}
            pane="right"
            title={conversation.title}
            description={conversation.description}
            conversationId={conversation._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      await registerUser({ email, username, password });
      setErrorMessage('');
      setIsRegistered(true);
    }
    catch (error) {
      console.error('Registration failed', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register">
      {!isRegistered ? (
        <div className="register-form">
        <h1>Register</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="registration-error-message">{errorMessage}</p>}
        <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div className="registered-div">
          <h1>Registration Successful</h1>
          <p>Welcome, {username}!</p>
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      setErrorMessage('');
      setIsLoggedIn(true);
    }
    catch (error) {
      console.error('Login failed', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
    {!isLoggedIn ? (
      <div className="login-page">
        <h1>Login</h1>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    ) : (
      <div className="logged-in-div">
        <h1>Login Successful</h1>
        <p>Welcome, {username}!</p>
      </div>
    )}
    </div>
  );
};

const ForumBrowser = ({ pane, createNewTab}) => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending'); // trending, recent, active
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const populateForums = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/forum?filter=${filter}&search=${searchQuery}`);
        const data = await response.json();
        setForums(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    };
    
    populateForums();
  }, [filter, searchQuery]);

  return (
    <div className="forum-browser">
      <div className="forum-controls">
        <input 
          type="search" 
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="trending">Trending</option>
          <option value="recent">Recently Created</option>
          <option value="active">Most Active</option>
        </select>
      </div>
      
      <div className="forum-list">
        {forums.map(forum => (
          <ForumCard
            pane={pane}
            name={forum.name}
            description={forum.description}
            forumId={forum._id}
            key={forum._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

const ConversationCard = ({pane, title, description, conversationId, createNewTab}) => {
  const handleClick = () => {
    createNewTab(
      "right",  // Always create in right pane
      title,
      "graph view",
      conversationId
    );
  };

  return (
    <div className="conversation-card" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const RootContainer = ({tabs, panes, togglePane, closeTab, createNewTab, selectTab}) => {
  return (
    <div className="RootContainer">
      <PaneControlPanel paneStates={panes} togglePanes={togglePane} tabStates={tabs} closeTab={closeTab} createNewTab={createNewTab} selectTab={selectTab}/>
      <div className="pane-container">
        {panes["left"].visible && (
          <Pane 
            title={tabs.left[panes.left.currentTabIndex].title}
            type={tabs.left[panes.left.currentTabIndex].type}
            id={tabs.left[panes.left.currentTabIndex].id}
            pane="left"
            createNewTab={createNewTab}
          />)}
        <Pane 
          title={tabs.central[panes.central.currentTabIndex].title}
          type={tabs.central[panes.central.currentTabIndex].type}
          id={tabs.central[panes.central.currentTabIndex].id}
          pane="central"
          createNewTab={createNewTab}
        />
        {panes["right"].visible && (
          <Pane 
            title={tabs.right[panes.right.currentTabIndex].title}
            type={tabs.right[panes.right.currentTabIndex].type}
            id={tabs.right[panes.right.currentTabIndex].id}
            pane="right"
            createNewTab={createNewTab}
          />)}
      </div>
    </div>
  );
};

export default RootContainer;