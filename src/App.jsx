import { useState } from 'react';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import AuthPage from './pages/AuthPage';
    import Dashboard from './pages/Dashboard';
    import './App.css';

    function App() {
      const [darkMode, setDarkMode] = useState(true);

      return (
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </div>
      );
    }

    export default App;
