import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Blockquote from '@tiptap/extension-blockquote';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import TurndownService from 'turndown';
import { savePost } from '../services/api/savePost';
import './MarkdownEditor.css';

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

export default MarkdownEditor;