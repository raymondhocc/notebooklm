import { useState } from 'react';
    import ReactMarkdown from 'react-markdown';

    export default function DocumentView({ document }) {
      const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'raw'

      if (!document) return <div className="document-view empty">Select a document to view</div>;

      return (
        <div className="document-view">
          <div className="toolbar">
            <button onClick={() => setViewMode('preview')}>Preview</button>
            <button onClick={() => setViewMode('raw')}>Raw Text</button>
          </div>
          
          {viewMode === 'preview' ? (
            <ReactMarkdown className="markdown-content">
              {document.content}
            </ReactMarkdown>
          ) : (
            <pre className="raw-content">
              {document.content}
            </pre>
          )}
        </div>
      );
    }
