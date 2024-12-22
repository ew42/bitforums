import React, { useState }from 'react';
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

const Pane = ({ title="test" }) => {
  return (
  <div className="pane">
    <h1>{title}</h1>
  </div>
)};

const RootContainer = () => {

  //tab stuff
  const [tabs, setTabStates] = useState({
    left: [{title: "top posts", content: "blah blah blah", visible: true}],
    central: [{title: "viewer", content: "you're a bum", visible: true}, {title: "editor", content: "balls", visible: false}],
    right: [{title: "top forums", content: "sineP", visible: true}]
  });

  //pane stuff
  const [panes, setPaneStates] = useState({
    left: {currentTabIndex: 0, numOfTabs: 1, visible: true},
    central: {currentTabIndex: 0, numOfTabs: 2, visible: true},
    right: {currentTabIndex: 0, numOfTabs: 1, visible: true}
  });

//pane here means name of pane
  const togglePane = (pane) => {
    setPaneStates(prevPanes => ({
      ...prevPanes,
      [pane]: {
        ...prevPanes[pane],
        visible: !prevPanes[pane].visible
      }
    }))
  };

  const selectTab = (pane, tabIndex) => {

    const currentTabIndex = panes[pane].currentTabIndex;

    setPaneStates(prevPanes => ({
        ...prevPanes,
        [pane]: {
          ...prevPanes[pane],
          currentTabIndex: tabIndex
        }
    }));
    setTabStates(prevTabs => ({
      ...prevTabs,
      [pane]: prevTabs[pane].map((tab, index) => ({
          ...tab,
          visible: index === tabIndex 
        }))
      
    }));
  };

  const closeTab = (pane, tabIndex) => {

    const tabNumber = panes[pane].numOfTabs;
    const lastTabIndex = tabNumber - 1;
    const selectedTabIndex = panes[pane].currentTabIndex;

    const isLastTab = tabNumber === 1;
    const isSelectedTab = selectedTabIndex === tabIndex;
    const newSelectedIndex = tabIndex === 0 ? 0 : tabIndex - 1;

    setTabStates(prevTabs => {
      if (isLastTab) {
        return {
          ...prevTabs,
          [pane]: [{
            title: "Untitled",
            content: "Dafuq",
            visible: true
          }]
        }
      }

      const updatedTabs = prevTabs[pane].filter((_, index) => index !== tabIndex);

      if (isSelectedTab) {
        return {
          ...prevTabs,
          [pane]: updatedTabs.map((tab, index) => ({
              ...tab,
              visible: index === newSelectedIndex
          }))
        }
      }
      else {
        return {
          ...prevTabs,
          [pane]: updatedTabs.map((tab, index) => ({
            ...tab,
            visible: index === selectedTabIndex - (tabIndex < selectedTabIndex ? 1 : 0)
          }))
        }
      }
    });

    setPaneStates(prevPanes => {
      if (isLastTab) {
        if (pane === "right" || pane === "left") {
          return {
            ...prevPanes,
            [pane]: {
              numOfTabs: 1,
              currentTabIndex: 0,
              visible: false
            }
          }
        }
        else { // central pane
          return {
            ...prevPanes,
            pane: {
              ...prevPanes[pane],
              numOfTabs: 1,
              currentTabIndex: 0
            }
          }
        }
      }
      else if (isSelectedTab) {
        return {
          ...prevPanes,
          [pane]: {
            ...prevPanes[pane],
            numOfTabs: tabNumber - 1,
            currentTabIndex: newSelectedIndex
          }
        }
      }
      else {
        return {
          ...prevPanes,
          [pane]: {
            ...prevPanes[pane],
            numOfTabs: tabNumber - 1,
            currentTabIndex: selectedTabIndex - (tabIndex < selectedTabIndex ? 1 : 0)
          }
        }
      }
    });
  };



  const createNewTab = (pane) => {

    const tabIndex = panes[pane].numOfTabs;

    setTabStates(prevTabs => ({
      ...prevTabs,
      [pane]: [
        ...prevTabs[pane].map((tab) => ({
        ...tab,
        visible: false
        })),
        {title: "Untitled", content: "You're Next", visible: true}
      ]

    }));

    setPaneStates(prevPanes => ({
      ...prevPanes,
      [pane]: {
        ...prevPanes[pane],
        numOfTabs: prevPanes[pane].numOfTabs + 1,
        currentTabIndex: tabIndex
      }
    }));

  };


  return (
  <div className="RootContainer">
    <PaneControlPanel paneStates={panes} togglePanes={togglePane} tabStates={tabs} closeTab={closeTab} createNewTab={createNewTab} selectTab={selectTab}/>
    <div className="pane-container">
        {panes["left"].visible && (
        <Pane title={tabs.left[panes.left.currentTabIndex].title}/>)}
        <Pane title={tabs.central[panes.central.currentTabIndex].title}/>
        {panes["right"].visible && (
        <Pane title={tabs.right[panes.right.currentTabIndex].title}/>)}
    </div>
  </div>
)};

export default RootContainer;
