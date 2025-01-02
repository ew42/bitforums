import { fetchPosts } from '../services/api/fetchPosts';
import { fetchForums } from '../services/api/fetchForums.js';
import { useState, useEffect } from 'react';

const useTabData = () => {

  //tab stuff
  const [tabs, setTabStates] = useState({
    left: [{title: "top forums", visible: true, type: "forum browser"}],
    central: [{title: "Best Friends Ever", visible: true, type: "viewer"}],
    right: [{title: "top posts", visible: true, type: "viewer"}]
  });

  //pane stuff
  const [panes, setPaneStates] = useState({
    left: {currentTabIndex: 0, numOfTabs: 1, visible: true},
    central: {currentTabIndex: 0, numOfTabs: 1, visible: true},
    right: {currentTabIndex: 0, numOfTabs: 1, visible: true}
  });

  // const[isLoading, setIsLoading] = useState(true);
  // const[error, setError] = useState(null);

  // useEffect(() => {
  //   async function fetchInitialData() {
  //     setIsLoading(true);
  //     try {
  //       // const [postsData, forumsData] = await Promise.all([
  //       const postData = await fetchPosts('67744aeab028014cfe718327');
  //       const forumData = await fetchForums('67744aeab028014cfe71831b');
  //       // ]);
  //       setTabStates(prevTabs => ({
  //         ...prevTabs,
  //         left: [{
  //           title: postData.title,
  //           content: postData.content,
  //           visible: true
  //         }],
  //         right: [{
  //           title: forumData.name,
  //           type: "forum",
  //           content: forumData.content,
  //           forumId: forumData._id,
  //           visible: true
  //         }]
  //       }));
  //     }
  //     catch (error) {
  //       console.error('Error fetching tab data:', error);
  //       setTabStates(prevTabs => ({
  //         ...prevTabs,
  //         left: [{
  //           title: "top posts",
  //           content: "Error fetching top posts",
  //           visible: true
  //         }],
  //         right: [{
  //           // title: "top forums",
  //           // content: "Error fetching top forums",
  //           // visible: true
  //         }]
  //       }));
  //     }
  //   }
  //   fetchInitialData();
  // }, []);

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



  const createNewTab = (pane, title = "untitled", type = "viewer", id = "") => {

    const tabIndex = panes[pane].numOfTabs;
    const existingTabIndex = tabs[pane].findIndex(tab => tab.id === id);
    if (id !== "") {
      const paneNames = ["left", "central", "right"];
      for (const paneName of paneNames) {
        if (existingTabIndex !== -1) {
          setTabStates(prevTabs => ({
            ...prevTabs,
            [pane]: prevTabs[pane].map((tab, index) => ({
              ...tab,
              visible: existingTabIndex === index
            }))
          }));
          setPaneStates(prevPanes => ({
            ...prevPanes,
            [pane]: {
              ...prevPanes[pane],
              currentTabIndex: existingTabIndex
            }
          }))
          return;
        }
      }
    }

    setTabStates(prevTabs => ({
      ...prevTabs,
      [pane]: [
        ...prevTabs[pane].map((tab) => ({
        ...tab,
        visible: false
        })),
        {title: title, visible: true, type: type, id: id}
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

  return {
    tabs,
    panes,
    togglePane,
    selectTab,
    closeTab,
    createNewTab
  };

}

export default useTabData;