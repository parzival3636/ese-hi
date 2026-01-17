import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Dashboard.css'

const DeveloperDashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Developer Dashboard</h1>
        <div className="user-info">
          <span>Welcome back, {user.first_name}!</span>
          <Link to="/profile" className="profile-link">Profile</Link>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Applications</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Projects Completed</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <span className="stat-number">$0</span>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <span className="stat-number">0%</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="recent-projects">
            <h2>Recent Project Applications</h2>
            <div className="project-list">
              <div className="empty-state">
                <p>No applications yet. Start browsing projects to apply!</p>
              </div>
            </div>
            <Link to="/projects" className="view-all">Browse Projects</Link>
          </section>

          <section className="recommended-projects">
            <h2>Recommended Projects</h2>
            <div className="project-list">
              <div className="empty-state">
                <p>Complete your profile to see personalized project recommendations.</p>
              </div>
            </div>
            <Link to="/projects" className="view-all">Browse All Projects</Link>
          </section>
        </div>

        <aside className="sidebar">
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <Link to="/projects" className="btn btn-primary">Browse Projects</Link>
            <Link to="/profile/edit" className="btn btn-secondary">Edit Profile</Link>
            <Link to="/portfolio" className="btn btn-secondary">Manage Portfolio</Link>
            <Link to="/earnings" className="btn btn-secondary">View Earnings</Link>
          </div>

          <div className="profile-completion">
            <h3>Profile Completion</h3>
            <div className="progress-bar">
              <div className="progress" style={{width: '75%'}}></div>
            </div>
            <p>75% Complete</p>
            <Link to="/profile/edit">Complete your profile</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default DeveloperDashboard