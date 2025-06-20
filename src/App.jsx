import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { UserProfile } from './views/UserProfile'
import RegisterPage from './views/RegisterPage'
import HomePage from './views/HomePage'
import { TestLoginPage } from './views/TestLoginPage'
import { SessionGuard } from './components/SessionGuard'



function App() {
  return (
  <Router>
    <Routes>
      <Route path ="/User-Profile" element={<SessionGuard><UserProfile /></SessionGuard>}/>
      <Route path="/User-Register" element={<RegisterPage />} />
      <Route path="/User-HomePage" element={<SessionGuard><HomePage /></SessionGuard>} />
      <Route path="/" element={<TestLoginPage />} />
    </Routes>
  </Router>      
  )
}

export default App
