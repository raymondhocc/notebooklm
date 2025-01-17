import { useState } from 'react';
    import { FaUpload, FaFilePdf, FaFileAlt } from 'react-icons/fa';

    export default function DocumentUpload({ onUpload }) {
      const [file, setFile] = useState(null);
      const [isDragging, setIsDragging] = useState(false);

      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
      };

      const handleDragLeave = () => {
        setIsDragging(false);
      };

      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
          setFile(droppedFile);
        }
      };

      const handleUpload = async () => {
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const content = e.target.result;
            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                file: content.split(',')[1],
                type: file.type
              })
            });

            if (response.ok) {
              const data = await response.json();
              onUpload(data);
              setFile(null);
            }
          };
          reader.readAsDataURL(file);
        }
      };

      return (
        <div className="document-upload">
          <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="file-preview">
                {file.type === 'application/pdf' ? (
                  <FaFilePdf className="file-icon" />
                ) : (
                  <FaFileAlt className="file-icon" />
                )}
                <p>{file.name}</p>
                <button onClick={handleUpload} className="upload-btn">
                  <FaUpload /> Upload
                </button>
              </div>
            ) : (
              <>
                <p>Drag & drop a file here</p>
                <p>or</p>
                <label className="file-input-label">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                  />
                  Browse Files
                </label>
              </>
            )}
          </div>
        </div>
      );
    }
