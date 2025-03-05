import React from 'react';
import PaneControlPanel from './PaneControlPanel';
import Pane from './Pane';
import "./RootContainer.css";

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
            metadata={tabs.left[panes.left.currentTabIndex].metadata}
          />)}
        <Pane 
          title={tabs.central[panes.central.currentTabIndex].title}
          type={tabs.central[panes.central.currentTabIndex].type}
          id={tabs.central[panes.central.currentTabIndex].id}
          pane="central"
          createNewTab={createNewTab}
          metadata={tabs.central[panes.central.currentTabIndex].metadata}
        />
        {panes["right"].visible && (
          <Pane 
            title={tabs.right[panes.right.currentTabIndex].title}
            type={tabs.right[panes.right.currentTabIndex].type}
            id={tabs.right[panes.right.currentTabIndex].id}
            pane="right"
            createNewTab={createNewTab}
            metadata={tabs.right[panes.right.currentTabIndex].metadata}
          />)}
      </div>
    </div>
  );
};

export default RootContainer;