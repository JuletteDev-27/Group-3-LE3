import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserBearerTokenContext } from './components/userBearerTokenContext';
import RegisterPage from './views/RegisterPage';
import LandingPage from './views/LandingPage';

function App() {
  const [userBearerToken, setUserBearerToken] = useState(null);

  return (
    <UserBearerTokenContext.Provider value={{ userBearerToken, setUserBearerToken }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserBearerTokenContext.Provider>
  );
}

export default App;