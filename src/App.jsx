import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {UserBearerTokenContext } from './components/userBearerTokenContext'
import { UserProfile } from './views/UserProfile'
import RegisterPage from './views/RegisterPage'
import { UserDataContext } from './components/UserDataContext'
import HomePage from './views/HomePage'



function App() {
  const [userBearerToken, setUserBearerToken] = useState(undefined)
  const [userData, setUserData] = useState({})
  return (
    
      <UserBearerTokenContext.Provider value={{ userBearerToken, setUserBearerToken }}>
        <UserDataContext.Provider value={{ userData, setUserData }}>
          <Router>
            <Routes>
              <Route path ="/User-Profile" element={<UserProfile />}/>
              <Route path="/User-Register" element={<RegisterPage />} />
              <Route path="/User-HomePage" element={<HomePage />} />
            </Routes>
          </Router>
        </UserDataContext.Provider>
      </UserBearerTokenContext.Provider>
  )
}

export default App
