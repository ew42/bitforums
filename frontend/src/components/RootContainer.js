import React, { useState}from 'react';
import "./RootContainer.css";


//What are the rules for the control panels?
//Need to distinguish between panes and tabs
//Pane needs to have a state that is number of tabs

//const TabController = ({ title , number}) => {
//  return (
//    <div className="tab-controller">
//      <p className="tab-controller-title">{title}</p>
//      <button className="tab-x-button" onClick={( {title} ) => {
//
//        }}>X</button>
//    </div>
//)};

const PaneControlPanel = ({ paneStates, togglePanes}) => {

  return (
    <div className="pane-control-panel">
      <div className="button-div">
        <div className="left-pane-div">
          <button className="left-button" onClick={() => {togglePanes(0)}}>Left Pane</button>
        </div>
        <div className="right-pane-div">
          <button className="right-button" onClick={() => {togglePanes(1)}}>Right Pane</button>
        </div>
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

  const [paneStates, setPaneStates] = useState([true, true]);

  const togglePane = (index) => {
    setPaneStates(prevPanes => {
      const newPanes = [...prevPanes];
      newPanes[index] = !newPanes[index];
      return newPanes;
    })
  };

  return (
  <div className="RootContainer">
    <PaneControlPanel paneStates={paneStates} togglePanes={togglePane}/>
    <div className="pane-container">
        {paneStates[0] && (
        <Pane title="Left Pane"/>)}
        {paneStates[1] && (
        <Pane title="Right Pane"/>)}
    </div>
  </div>
)};

export default RootContainer;
