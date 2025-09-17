import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Info } from './pages/Info';
import { HealthResponse } from './types/api';
import { getHealth } from './api/endpoints';

function App() {
  const [healthData, setHealthData] = useState<HealthResponse | undefined>();
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    loadHealth();
    
    // Set up periodic health checks
    const interval = setInterval(loadHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      const response = await getHealth();
      setHealthData(response);
    } catch (error) {
      setHealthData(undefined);
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          healthData={healthData} 
          healthLoading={healthLoading}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;