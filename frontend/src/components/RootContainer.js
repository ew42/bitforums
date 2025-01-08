import React, { useState, useEffect } from 'react';
import { registerUser } from '../services/api/registerUser';
import { loginUser } from "../services/api/loginUser";
import { fetchForum, fetchForums, createNewForum } from "../services/api/forumService"
import { fetchPosts } from "../services/api/fetchPosts";
import { savePost } from "../services/api/savePost";
import "./RootContainer.css";
import "./GraphView";
import { fetchConversationPosts, createNewConversation } from '../services/api/conversationServices';
import GraphView from './GraphView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Markdown from 'react-markdown';
import "./MarkdownEditor.css";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Blockquote from '@tiptap/extension-blockquote';
import config from '../config';
import TurndownService from 'turndown';
import { fetchUserPosts } from '../services/api/fetchUserPosts';
import { toggleUpvote } from '../services/api/postService';

const Profile = ({ userdata, createNewTab }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    forum: '',
    conversation: '',
    search: ''
  });

  const handleFetchUserPosts = async () => {
    if (!userdata?.userId) {
      console.error('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchUserPosts(userdata.userId, filters);
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userdata?.userId) {
      handleFetchUserPosts();
    }
  }, [userdata?.userId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userdata?.userId) {
    return <div>No user data available</div>;
  }

  return (
    <div className="profile-container">
      <h1>{userdata?.username}'s Posts</h1>
      
      <div className="filter-controls">
        <input
          type="text"
          name="forum"
          placeholder="Filter by forum..."
          value={filters.forum}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="conversation"
          placeholder="Filter by conversation..."
          value={filters.conversation}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="search"
          name="search"
          placeholder="Search posts..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />
      </div>

      {loading ? (
        <div>Loading posts...</div>
      ) : posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard
              key={post._id}
              title={post.title}
              author={post.author.username}
              createdAt={post.createdAt}
              postId={post._id}
              postConversation={post.conversation?.title || 'No conversation'}
              createNewTab={createNewTab}
            />
          ))}
        </div>
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
};

const PostCard = ({ title, author, createdAt, postId, postConversation, createNewTab }) => {
  const handleClick = () => {
    createNewTab(
      "central",
      title,
      "viewer",
      postId
    );
  };

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="post-card" onClick={handleClick}>
      <h3><strong>{title}</strong></h3>
      <div className="post-metadata">
        <span className="author">By {author} | </span>
        <span className="date">on {formattedDate} </span>
      </div>
    </div>
  );
};

const ConversationSettings = ({ forum, createNewTab }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      const conversation = await createNewConversation({
        title,
        description,
        forumId: forum._id
      });
      createNewTab(
        "central",
        conversation.title,
        "conversation",
        conversation._id
      );
    } catch (error) {
      // Handle specific error messages from the backend
      if (error.message.includes('Only moderators and contributors')) {
        setError('You need to be a moderator or contributor to create conversations in this forum');
      } else {
        setError(error.message || 'Failed to create conversation');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='conversation-settings'>
      <h2>Create New Conversation</h2>
      {error && <div className="error-message">{error}</div>}
      <input 
        type='text'
        value={title}
        placeholder='Conversation Title'
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <input 
        type='text'
        value={description}
        placeholder='Description'
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <button 
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Conversation'}
      </button>
    </div>
  );
};

const ForumCard = ({pane, name, description, forumId, createNewTab}) => {
  const handleClick = () => {
    createNewTab(
      pane, 
      name,
      "forum",
      forumId
    );
  };

  return (
    <div className="forum-card" onClick={handleClick}>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};

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
)};

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
    }

  };

  return (
    <div className="pane">
      {renderContent()}
    </div>
  );
};

const Viewer = ({ title="test", postId, createNewTab}) => {
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleProfileClick = () => {
    console.log('postdata:', postData)
    createNewTab(
      "central",
      postData.author.username,
      "profile",
      postData.author._id,
      {userId: postData.author._id, username: postData.author.username}
    )
  };

  const handleUpvote = async () => {
    try {
      const result = await toggleUpvote(postId);
      setPostData(prev => ({
        ...prev,
        score: result.score
      }));
      setHasUpvoted(result.hasUpvoted);
    } catch (error) {
      if (error.message === 'Must be logged in to upvote') {
        createNewTab("central", "Login", "login");
      } else {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadPostData() {
      if (!postId) {
        setError("No post ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchPosts(postId);
        if (isMounted) {
          setPostData(data);
          setError(null);
        }
      }
      catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
      finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPostData();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  return (
    <div className="viewer">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : postData ? (
        <div>
          <div className="viewer-title">
            <h2><strong>{postData.title}</strong></h2>
            <p className="author-tag" onClick={handleProfileClick}>
              by <em>{postData.author.username}</em> | on {new Date(postData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className="markdown-content"
          >
            {postData.content}
          </ReactMarkdown>
          <button 
            className={`upvote-button ${hasUpvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
          >
            ▲ {postData?.score || 0}
          </button>
        </div>
      ) : (
        <p>No post data available</p>
      )}
    </div>
  );
};

const Forum = ({ title="Forum", forumId, createNewTab}) => {
  const [forumData, setForumData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNewConversation = () => {
    createNewTab(
      'central',
      'Conversation Settings',
      'conversation settings',
      '',
      forumData
    )
  };

  useEffect(() => {

    let isMounted = true;

    async function loadForumData() {
      console.log(forumId);
      if (!forumId) {
        setError("No forum ID provided");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchForum(forumId);
        console.log("data populated");
        setForumData(data);
        setError(null);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    loadForumData(forumId);
    return () => {
      isMounted = false;
    };
  }, [forumId]);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }
  if (!forumData) {
    return (
      <div>No forum data available</div>
    );
  }

  return (
    <div className="forum-data">
      <h1>{forumData.name}</h1>
      <p>{forumData.description}</p>
      <div className="conversation-header">
        <h2>Conversations:</h2>
        <button className="new-conversation-button" onClick={handleNewConversation}>+</button>
      </div>
      <div className="conversation-list">
        {forumData.conversations.map(conversation => (
          <ConversationCard
            key={conversation._id}
            pane="right"
            title={conversation.title}
            description={conversation.description}
            conversationId={conversation._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      await registerUser({ email, username, password });
      setErrorMessage('');
      setIsRegistered(true);
    }
    catch (error) {
      console.error('Registration failed', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="register">
      {!isRegistered ? (
        <div className="register-form">
        <h1>Register</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="registration-error-message">{errorMessage}</p>}
        <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div className="registered-div">
          <h1>Registration Successful</h1>
          <p>Welcome, {username}!</p>
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      setErrorMessage('');
      setIsLoggedIn(true);
    }
    catch (error) {
      console.error('Login failed', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
    {!isLoggedIn ? (
      <div className="login-page">
        <h1>Login</h1>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p className="login-error-message">{errorMessage}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    ) : (
      <div className="logged-in-div">
        <h1>Login Successful</h1>
        <p>Welcome, {username}!</p>
      </div>
    )}
    </div>
  );
};

const ForumBrowser = ({ pane, createNewTab}) => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('trending'); // trending, recent, active
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const populateForums = async () => {
      try {
        const response = await fetch(`${config.API_URL}/forum?filter=${filter}&search=${searchQuery}`);
        const data = await response.json();
        setForums(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    };
    
    populateForums();
  }, [filter, searchQuery]);

  const handleNewForum = () => {
    createNewTab(
      'central',
      'Forum Settings',
      'forum settings'
    );
  };

  return (
    <div className="forum-browser">
      <div className="forum-controls">
        <input 
          type="search" 
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="trending">Trending</option>
          <option value="recent">Recently Created</option>
          <option value="active">Most Active</option>
        </select>
        <button onClick={handleNewForum}>Create New Forum</button>
      </div>
      
      <div className="forum-list">
        {forums.map(forum => (
          <ForumCard
            pane={pane}
            name={forum.name}
            description={forum.description}
            forumId={forum._id}
            key={forum._id}
            createNewTab={createNewTab}
          />
        ))}
      </div>
    </div>
  );
};

const ConversationCard = ({pane, title, description, conversationId, createNewTab}) => {
  const handleClick = () => {
    createNewTab(
      "right",  // Always create in right pane
      title,
      "graph view",
      conversationId,
      { conversationId: conversationId }  // Pass metadata with conversation ID
    );
  };

  return (
    <div className="conversation-card" onClick={handleClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const MarkdownEditor = ({ initialValue = '', onSave, metadata = {}, readOnly = false }) => {
  const [title, setTitle] = useState('');
  const [err, setErr] = useState(null);
  const [saved, setSaved] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6]
      }),
      Bold,
      Italic,
      Blockquote
    ],
    content: initialValue,
    editable: !readOnly
  });

  const handleSave = async () => {
    if (editor) {
      const turndownService = new TurndownService();
      const htmlContent = editor.getHTML();
      const markdownContent = turndownService.turndown(htmlContent);
      
      try {
        const postData = {
          title: title,
          content: markdownContent,
          conversation: metadata.conversationId,
          parentPosts: metadata.parentPosts || []
        };
        console.log("Saving post with data:", postData);
        await savePost(postData);
        console.log("Post saved successfully");
        setSaved(true);
      } catch (error) {
        console.error("Failed to save post:", error);
        setErr(error);
      }
    }
  };

  if (readOnly) {
    return (
      <div className="markdown-display">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {initialValue}
        </ReactMarkdown>
      </div>
    );
  }

  else if (err) {
    return (
      <div className="markdown-editor-error">
        <p>Error: {err.message}</p>
      </div>
    );
  }
  else if (saved) {
    return (
      <div className="markdown-editor-saved">
        <p>Saved!</p>
      </div>
    );
  }
  return (
    <div className="markdown-editor">

      <div className="editor-toolbar">
        <div className="non-save-buttons">
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
      <input
        type="text"
        placeholder="Enter post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />
      <EditorContent editor={editor} />
    </div>
  );
};

const ForumSettings = ({ createNewTab }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await createNewForum({
        name,
        description
      });

      setIsSuccess(true);
      
      // Open the new forum view
      createNewTab(
        "left",
        name,
        "forum",
        response._id
      );
    }
    catch (error) {
      setError(error.message || 'Failed to create forum. Please try again.');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='forum-settings success'>
        <h2>Forum Created Successfully!</h2>
        <p>Your new forum "{name}" has been created.</p>
      </div>
    );
  }

  return (
    <div className='forum-settings'>
      <h1>Create new forum</h1>
      {error && <div className="error-message">{error}</div>}
      <input 
        type='text' 
        value={name} 
        placeholder='Forum Name' 
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <input 
        type='text' 
        value={description} 
        placeholder='Description' 
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <button 
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Forum'}
      </button>
    </div>
  );
};

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