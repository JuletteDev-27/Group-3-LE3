import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { UserBearerToken } from './components/userBearerTokenContext'



function App() {
  const [userBearerToken, setUserBearerToken] = useState(null)
  return (
      <UserBearerToken.Provider value={{ userBearerToken, setUserBearerToken }}>
        <Router>
          <Routes>
            // Insert your routes here
          </Routes>
        </Router>
      </UserBearerToken.Provider>
  )
}

export default App
