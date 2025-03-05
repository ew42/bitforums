import React from 'react';
import Tab from './common/Tab';
import './PaneControlPanel.css';

const PaneControlPanel = ({ tabStates, paneStates, togglePanes, closeTab, createNewTab, selectTab }) => {
  return (
    <div className="pane-control-panel">
      <div className="left-pane-div">
        {tabStates.left?.map((tab, arrayIndex) => (
          <Tab 
            key={`left-tab-${arrayIndex}`}
            pane="left" 
            tab={tab} 
            tabIndex={arrayIndex} 
            closeTab={closeTab} 
            selectTab={selectTab}
            paneStates={paneStates}
          />
        ))}
        {/* <button className="left-add" onClick={() => {createNewTab("left", "Forum Browser", "forum browser")}}>+</button> */}
        <button className="left-toggle" onClick={() => {togglePanes("left")}}>Left Pane</button>
      </div>
      <div className="central-pane-div">
        {tabStates.central?.map((tab, arrayIndex) => <Tab key={
          `central-tab-${arrayIndex}`} pane="central" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab} paneStates={paneStates}/>
        )}
        {/* <button className="central-add" onClick={() => {createNewTab("central")}}>+</button> */}
      </div>
        <div className="right-pane-div">
          {tabStates.right?.map((tab, arrayIndex) => <Tab key={
          `right-tab-${arrayIndex}`} pane="right" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab} paneStates={paneStates}/>
        )}
          {/* <button className="right-add" onClick={() => {createNewTab("right")}}>+</button> */}
          <button className="right-toggle" onClick={() => {togglePanes("right")}}>Right Pane</button>
      </div>
    </div>
  );
};

export default PaneControlPanel;