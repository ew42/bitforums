import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/api/registerUser';
import { loginUser } from "../services/api/loginUser";
import { fetchForums } from "../services/api/fetchForums"
import { fetchPosts } from "../services/api/fetchPosts"
import "./RootContainer.css";

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

const Pane = ({ title="test", type="viewer", content="test", forumId }) => {
  const renderContent = () => {
    switch (type) {
      case "viewer":
        return <Viewer title={title} content={content} />;
      // case "editor":
      //   return <Editor title={title} />;
      case "forum":
        return <Forum title={title} forumId={forumId} />;
      case "register":
        return <Register />;
      case "login":
        return <Login />;
    }
  };

  return (
  <div className="pane">
    {renderContent()}
  </div>
)};

const Viewer = ({ title="test", content="test" }) => {
  return (
  <div className="viewer">
    <h1>{title}</h1>
    <p>{content}</p>
  </div>
)};

const Forum = ({ title="Forum", forumId }) => {
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
        const data = await fetchForums(forumId);
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
      <ul>
      {forumData.conversations.map(conversation => (
        <li key={conversation._id}>
          <h3>{conversation.title}</h3>
          <p>{conversation.description}</p>
        </li>
      ))}
      </ul>
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

const RootContainer = ({tabs, panes, togglePane, closeTab, createNewTab, selectTab}) => {

  return (
  <div className="RootContainer">
    <PaneControlPanel paneStates={panes} togglePanes={togglePane} tabStates={tabs} closeTab={closeTab} createNewTab={createNewTab} selectTab={selectTab}/>
    <div className="pane-container">
        {panes["left"].visible && (
        <Pane 
          title={tabs.left[panes.left.currentTabIndex].title}
          type={tabs.left[panes.left.currentTabIndex].type}
          content={tabs.left[panes.left.currentTabIndex].content}
          forumId={tabs.left[panes.left.currentTabIndex.forumId]}
          />)}
        <Pane 
        title={tabs.central[panes.central.currentTabIndex].title}
        type={tabs.central[panes.central.currentTabIndex].type}
        content={tabs.central[panes.central.currentTabIndex].content}
        forumId={tabs.central[panes.left.currentTabIndex.forumId]}
        />
        {panes["right"].visible && (
        <Pane 
        title={tabs.right[panes.right.currentTabIndex].title}
        type={tabs.right[panes.right.currentTabIndex].type}
        content={tabs.right[panes.right.currentTabIndex].content}
        forumId={tabs.right[panes.right.currentTabIndex.forumId]}
        />)}
    </div>
  </div>
)};

export default RootContainer;