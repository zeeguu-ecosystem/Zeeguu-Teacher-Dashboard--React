import { Router } from '@reach/router'

import React, { useState, useEffect } from 'react'
import { useCookie } from '@use-hook/use-cookie'

import './assets/styles/App.scss'

import Nav from './components/Nav'
import Classroom from './pages/Classroom'
import Home from './pages/Home'
import StudentPage from './pages/StudentPage'
import NotLoggedInPage from './pages/NotLoggedInPage'

import TimePeriodContext from './context/TimePeriodContext'
import UserContext from './context/UserContext'

import { getUserDetails } from './api/apiUser'

import { useAuthentication } from './utilities/permissions'

const App = () => {
  // const [timePeriod, setTimePeriod] = useCookie('timeperiod', 30)
  const [timePeriod, setTimePeriod] = useState(14)
  const { loadingAuth, isAuthenticated } = useAuthentication()
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    getUserDetails().then(details => {
      setUserDetails(details.data)
    })
  }, [])
  return (
    <TimePeriodContext.Provider value={{ timePeriod, setTimePeriod }}>
      <UserContext.Provider value={userDetails}>
        <div className="App">
          {loadingAuth ? null : isAuthenticated ? (
            <div>
              <Nav />
              <Router>
                <Home path="/" />
                <Classroom path="classroom/:cohortId" />
                <StudentPage path="student/:studentId" />
              </Router>
            </div>
          ) : (
            //should redirect to zeeguu login page?
            <NotLoggedInPage />
          )}
        </div>
      </UserContext.Provider>
    </TimePeriodContext.Provider>
  )
}

export default App
