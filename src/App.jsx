import { useState, useEffect } from 'react';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import AuthPage from './pages/AuthPage';
    import Dashboard from './pages/Dashboard';
    import DocumentView from './components/DocumentView';
    import InsightsPanel from './components/InsightsPanel';
    import NotesPanel from './components/NotesPanel';
    import './App.css';

    function App() {
      const [darkMode, setDarkMode] = useState(true);
      const [currentDocument, setCurrentDocument] = useState(null);

      return (
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={
                  <div className="main-content">
                    <DocumentView document={currentDocument} />
                    <div className="side-panels">
                      <NotesPanel />
                      <InsightsPanel document={currentDocument} />
                    </div>
                  </div>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      );
    }

    export default App;
