import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Dashboard.css'

const CompanyDashboard = () => {
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
        <h1>Company Dashboard</h1>
        <div className="user-info">
          <span>Welcome back, {user.first_name}!</span>
          <Link to="/profile" className="profile-link">Profile</Link>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Projects</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Completed Projects</h3>
          <span className="stat-number">0</span>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <span className="stat-number">$0</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="recent-projects">
            <h2>Active Projects</h2>
            <div className="project-list">
              <div className="empty-state">
                <p>No active projects. Post your first project to get started!</p>
              </div>
            </div>
            <Link to="/post-project" className="view-all">Post a Project</Link>
          </section>

          <section className="recent-applications">
            <h2>Recent Applications</h2>
            <div className="application-list">
              <div className="empty-state">
                <p>No applications yet. Post projects to start receiving applications from developers.</p>
              </div>
            </div>
            <Link to="/post-project" className="view-all">Post Your First Project</Link>
          </section>
        </div>

        <aside className="sidebar">
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <Link to="/post-project" className="btn btn-primary">Post New Project</Link>
            <Link to="/my-projects" className="btn btn-secondary">Manage Projects</Link>
            <Link to="/find-developers" className="btn btn-secondary">Find Developers</Link>
            <Link to="/payments" className="btn btn-secondary">Payment History</Link>
          </div>

          <div className="hiring-tips">
            <h3>Hiring Tips</h3>
            <ul>
              <li>Write clear project descriptions</li>
              <li>Set realistic budgets and timelines</li>
              <li>Review developer portfolios carefully</li>
              <li>Communicate requirements clearly</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CompanyDashboard