import React from 'react';
import './Tab.css';

const Tab = ({ pane, tab, tabIndex, closeTab, selectTab, paneStates }) => {
  const isSelected = paneStates[pane].currentTabIndex === tabIndex;
  
  return (
    <div className={`tab${isSelected ? '-selected' : ''}`}>
      <button className="tab-button" onClick={() => selectTab(pane, tabIndex)}>{tab.title}</button>
      {!(pane === "left" && tabIndex === 0) && (
        <button className="x-button" onClick={() => closeTab(pane, tabIndex)}>X</button>
      )}
    </div>
  );
};

export default Tab;