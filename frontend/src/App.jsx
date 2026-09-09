import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import BorrowerForm from './pages/BorrowerForm';
import AnalysisLoading from './pages/AnalysisLoading';
import Dashboard from './pages/Dashboard';
import Explainability from './pages/Explainability';

/**
 * Main Application Component with React Router Configuration
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          {/* Global Navigation Header */}
          <Navbar />

          {/* Page Content Routing */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/apply" element={<BorrowerForm />} />
              <Route path="/loading" element={<AnalysisLoading />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explainability" element={<Explainability />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
