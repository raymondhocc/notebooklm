import React, { useState, useEffect } from 'react';
    import './App.css';

    function App() {
      const [notes, setNotes] = useState([]);
      const [title, setTitle] = useState('');
      const [content, setContent] = useState('');

      useEffect(() => {
        fetch('http://localhost:3001/notes')
          .then(response => response.json())
          .then(data => setNotes(data));
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        })
          .then(response => response.json())
          .then(data => {
            setNotes([...notes, { id: data.id, title, content }]);
            setTitle('');
            setContent('');
          });
      };

      return (
        <div className="app">
          <h1>NotebookLM App</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Add Note</button>
          </form>
          <div className="notes">
            {notes.map(note => (
              <div key={note.id} className="note">
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default App;
