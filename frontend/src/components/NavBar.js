import React from 'react';
import './NavBar.css';

const NavBar = ({ tabs, createNewTab, selectTab, isLoggedIn, username }) => {
  const registerButton = () => {
    const existingRegisterTab = tabs.central.findIndex(tab => tab.type === "register")
    if (existingRegisterTab !== -1) {
      selectTab("central", existingRegisterTab);
    }
    else {
      createNewTab("central", "register", "register");
    }
  };

  const loginButton = () => {
    const existingLoginTab = tabs.central.findIndex(tab => tab.type === "login")
    if (existingLoginTab !== -1) {
      selectTab("central", existingLoginTab);
    }
    else {
      createNewTab("central", "login", "login");
    }
  };

  const profileButton = () => {
    const existingProfileTab = tabs.central.findIndex(tab => tab.type === "profile")
    if (existingProfileTab !== -1) {
      selectTab("central", existingProfileTab);
    }
    else {
      createNewTab("central", "profile", "profile");
    }
  };

  return (
    <nav className="nav-bar">
      <p>bitforums</p>
      <div className="account-buttons">
        {isLoggedIn ? (
          <button className="profile-button" onClick={profileButton}>
            Profile ({username})
          </button>
        ) : (
          <>
            <button className="login-button" onClick={loginButton}>Login</button>
            <button className="register-button" onClick={registerButton}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
