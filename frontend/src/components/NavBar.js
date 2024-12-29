import React from 'react';
import './NavBar.css';

const NavBar = ({ tabs, createNewTab, selectTab }) => {

  const registerButton = () => {
    const existingRegisterTab = tabs.central.findIndex(tab => tab.type === "register")
    if (existingRegisterTab !== -1) {
      console.log("Selecting:" , existingRegisterTab)
      selectTab("central", existingRegisterTab);
    }
    else {
      console.log("Creating a new register tab");
      createNewTab("central", "register");
      console.log(tabs)
    }
  };

  const loginButton = () => {
    const existingLoginTab = tabs.central.findIndex(tab => tab.type === "login")
    if (existingLoginTab !== -1) {
      console.log("Selecting:" , existingLoginTab)
      selectTab("central", existingLoginTab);
    }
    else {
      console.log("Creating a new login tab");
      createNewTab("central", "login");
      console.log(tabs)
    }
  };

  return (
    <nav className="nav-bar">
      <p>bitforums</p>
      <div className="account-buttons">
        <button className="login-button" onClick={loginButton}>Login</button>
        <button className="register-button" onClick={registerButton}>Register</button>
      </div>
    </nav>
)};

export default NavBar;
