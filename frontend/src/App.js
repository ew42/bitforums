import './App.css';
import './styles/global.css';
import RootContainer from './components/RootContainer.js';
import NavBar from './components/NavBar.js';
import useTabData from './hooks/useTabData.js';

function App() {
  const {tabs, panes, togglePane, selectTab, closeTab, createNewTab} = useTabData();
  return (
    <div className="App">
      <NavBar tabs={tabs} createNewTab={createNewTab} selectTab={selectTab}/>
      <RootContainer tabs={tabs} panes={panes} togglePane={togglePane} selectTab={selectTab} closeTab={closeTab} createNewTab={createNewTab} />
    </div>
  );
}

export default App;
