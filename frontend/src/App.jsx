import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import DeveloperRegister from './components/DeveloperRegister'
import CompanyRegister from './components/CompanyRegister'
import Dashboard from './components/Dashboard'
import DeveloperDashboard from './components/DeveloperDashboard'
import CompanyDashboard from './components/CompanyDashboard'
import Projects from './components/Projects'
import PostProject from './components/PostProject'
import Profile from './components/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/developer" element={<DeveloperRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
        <Route path="/dashboard/company" element={<CompanyDashboard />} />
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  )
}

export default App