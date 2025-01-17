import { useState, useEffect } from 'react';
    import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

    export default function NotesPanel() {
      const [notes, setNotes] = useState([]);
      const [newNote, setNewNote] = useState('');
      const [editingNoteId, setEditingNoteId] = useState(null);
      const [editContent, setEditContent] = useState('');

      useEffect(() => {
        // Load saved notes from localStorage
        const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
        setNotes(savedNotes);
      }, []);

      const saveNotes = (updatedNotes) => {
        setNotes(updatedNotes);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      };

      const handleAddNote = () => {
        if (newNote.trim()) {
          const updatedNotes = [...notes, {
            id: Date.now(),
            content: newNote,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }];
          saveNotes(updatedNotes);
          setNewNote('');
        }
      };

      const handleEditNote = (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
          setEditingNoteId(id);
          setEditContent(note.content);
        }
      };

      const handleSaveEdit = (id) => {
        const updatedNotes = notes.map(n => 
          n.id === id ? { ...n, content: editContent, updatedAt: new Date().toISOString() } : n
        );
        saveNotes(updatedNotes);
        setEditingNoteId(null);
      };

      const handleDeleteNote = (id) => {
        const updatedNotes = notes.filter(n => n.id !== id);
        saveNotes(updatedNotes);
      };

      return (
        <div className="notes-panel">
          <div className="panel-header">
            <h3>Notes</h3>
            <button onClick={handleAddNote} className="add-note-btn">
              <FaPlus /> Add Note
            </button>
          </div>
          
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                {editingNoteId === note.id ? (
                  <div className="edit-mode">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(note.id)}>Save</button>
                  </div>
                ) : (
                  <>
                    <p>{note.content}</p>
                    <div className="note-meta">
                      <small>
                        Created: {new Date(note.createdAt).toLocaleString()}
                        {note.updatedAt && ` | Updated: ${new Date(note.updatedAt).toLocaleString()}`}
                      </small>
                      <div className="note-actions">
                        <button onClick={() => handleEditNote(note.id)}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteNote(note.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="note-input">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
            />
          </div>
        </div>
      );
    }
