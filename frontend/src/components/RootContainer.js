import React, { useState}from 'react';
import "./RootContainer.css";

const Tab = ({ pane, tab, tabIndex, closeTab, selectTab}) => {
  return (
  <div className="tab">
      <button className="tab-button" onClick={() => selectTab(pane, tabIndex)}>{tab.title}</button>
      <button className="x-button" onClick={() => closeTab(pane, tabIndex)}>X</button>
  </div>
)};

const PaneControlPanel = ({ tabStates, paneStates, togglePanes, closeTab, openTab, selectTab }) => {

  return (
    <div className="pane-control-panel">
      <div className="left-pane-div">
        {tabStates.left?.map((tab, arrayIndex) => <Tab key={
          `left-tab-${arrayIndex}`} pane="left" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
        <button className="left-add" onClick={() => {openTab("left")}}>+</button>
        <button className="left-toggle" onClick={() => {togglePanes("left")}}>Left Pane</button>
      </div>
      <div className="central-pane-div">
        {tabStates.central?.map((tab, arrayIndex) => <Tab key={
          `central-tab-${arrayIndex}`} pane="central" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
        <button className="central-add" onClick={() => {openTab("central")}}>+</button>
      </div>
        <div className="right-pane-div">
          {tabStates.right?.map((tab, arrayIndex) => <Tab key={
          `right-tab-${arrayIndex}`} pane="right" tab={tab} tabIndex={arrayIndex} closeTab={closeTab} selectTab={selectTab}/>
        )}
          <button className="right-add" onClick={() => {openTab("right")}}>+</button>
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

//pane here means name of pane -- I think
  const togglePane = (pane) => {
    setPaneStates(prevPanes => ({
      ...prevPanes,
      [pane]: {
        ...prevPanes[pane],
        visible: !prevPanes[pane].visible
      }
    }))
  };

  const closeTab = (pane, tabIndex) => {
    setTabStates(prevTabs => ({
      ...prevTabs,
      [pane]: [
        ...prevTabs[pane].slice(0, tabIndex),
        ...prevTabs[pane].slice(tabIndex + 1)
      ]
    }));

    setPaneStates(prevPanes => ({
      ...prevPanes,
      [pane]: {
        ...prevPanes[pane],
        numOfTabs: prevPanes[pane].numOfTabs - 1
      }
    })
  )};

  const openTab = (pane) => {
    setTabStates(prevTabs => ({
      ...prevTabs,
      [pane]: [
        ...prevTabs[pane],
        {title: "Untitled", content: "You're a FN!"}
        ]
      }
    ))
      setPaneStates(prevPanes => ({
        ...prevPanes,
        [pane]: {
          ...prevPanes[pane],
          numOfTabs: prevPanes[pane].numOfTabs - 1
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
          visible: index === currentTabIndex
        }))
      
    }));
  };

  return (
  <div className="RootContainer">
    <PaneControlPanel paneStates={panes} togglePanes={togglePane} tabStates={tabs} closeTab={closeTab} openTab={openTab} selectTab={selectTab}/>
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
