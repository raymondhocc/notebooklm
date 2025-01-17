import { Link } from 'react-router-dom';
    import { FaPlus } from 'react-icons/fa';

    export default function Sidebar({ documents }) {
      return (
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Documents</h3>
            <button className="add-document-btn">
              <FaPlus />
            </button>
          </div>
          <ul className="document-list">
            {documents.map(doc => (
              <li key={doc.id} className="document-item">
                <Link to={`/document/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
