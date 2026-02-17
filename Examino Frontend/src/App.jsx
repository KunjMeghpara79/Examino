import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Components/Landingpage'
import LandingPage from './Components/Landingpage'

import { Routes, Route } from 'react-router-dom';
import LoginCard from './Components/LoginCard';
import OAuth2Callback from './Components/OAuth2Callback';

import StudentDashboard from './Components/StudentDashboard';
import TeacherDashboard from './Components/TeacherDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginCard />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </>
  )
}

export default App
