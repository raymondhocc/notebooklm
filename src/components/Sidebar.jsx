import { Link } from 'react-router-dom';

    export default function Sidebar({ documents }) {
      return (
        <div className="sidebar">
          <h3>Documents</h3>
          <ul>
            {documents.map(doc => (
              <li key={doc.id}>
                <Link to={`/document/${doc.id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
