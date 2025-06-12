import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {UserBearerTokenContext } from './components/userBearerTokenContext'
import { TestView } from './views/TestView'



function App() {
  const [userBearerToken, setUserBearerToken] = useState(null)
  return (
      <UserBearerTokenContext.Provider value={{ userBearerToken, setUserBearerToken }}>
        <Router>
          <Routes>
            //Insert Routes Here
          </Routes>
        </Router>
      </UserBearerTokenContext.Provider>
  )
}

export default App
