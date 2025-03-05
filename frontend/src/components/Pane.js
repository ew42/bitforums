import React from 'react';
import Viewer from './Viewer';
import Forum from './Forum';
import Register from './Register';
import Login from './Login';
import ForumBrowser from './ForumBrowser';
import GraphView from './GraphView';
import MarkdownEditor from './MarkdownEditor';
import ConversationSettings from './ConversationSettings';
import ForumSettings from './ForumSettings';
import Profile from './Profile';
import './Pane.css';

const Pane = ({ title="test", type="viewer", id, pane, createNewTab, metadata }) => {
  const renderContent = () => {
    switch (type) {
      case "viewer":
        return <Viewer title={title} postId={id} createNewTab={createNewTab}/>;
      case "forum":
        return <Forum title={title} forumId={id} createNewTab={createNewTab}/>;
      case "register":
        return <Register />;
      case "login":
        console.log("Generating login component");
        return <Login />;
      case "forum browser":
        return <ForumBrowser pane={pane} createNewTab={createNewTab} />;
      case "graph view":
        return <GraphView
          conversationId={id}
          onPostClick={(post) => {
            createNewTab(
              "central",
              post.title,
              "viewer",
              post._id
            )
          }}
          onCreatePost={(parentPostIds, conversationId) => {
            createNewTab(
              "central",
              "New Post",
              "editor",
              "",
              { 
                conversationId: conversationId,
                parentPosts: parentPostIds 
              }
            )
          }}
        />
      case "editor":
        return <MarkdownEditor 
          onSave={() => {console.log("Saving content")}}
          metadata={metadata}
        />;
      case "conversation settings":
        return <ConversationSettings 
        forum={metadata}
        createNewTab={createNewTab}
        />
      case "forum settings":
        return <ForumSettings createNewTab={createNewTab} />;
      case "profile":
        return <Profile userdata={metadata} createNewTab={createNewTab} />
      default:
        return <div>Unknown pane type: {type}</div>;
    }
  };

  return (
    <div className="pane">
      {renderContent()}
    </div>
  );
};

export default Pane;