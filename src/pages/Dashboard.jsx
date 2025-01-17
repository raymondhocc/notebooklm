import { useEffect, useState } from 'react';
    import { Outlet } from 'react-router-dom';
    import Sidebar from '../components/Sidebar';

    export default function Dashboard() {
      const [documents, setDocuments] = useState([]);

      useEffect(() => {
        const fetchDocuments = async () => {
          try {
            const response = await fetch('/api/documents');
            if (response.ok) {
              const data = await response.json();
              setDocuments(data);
            }
          } catch (error) {
            console.error('Error fetching documents:', error);
          }
        };

        fetchDocuments();
      }, []);

      return (
        <div className="dashboard">
          <Sidebar documents={documents} />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      );
    }
