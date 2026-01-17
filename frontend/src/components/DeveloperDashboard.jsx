import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUserProfile } from '../services/api'
import Navbar from './Navbar'
import './Dashboard.css'

const DeveloperDashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await getUserProfile()
        if (result.user) {
          setUser(result.user)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login to continue</div>

  return (
    <div>
      <Navbar user={user} />
      <div className="dashboard-container">
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
              <Link to="/dashboard/developer/portfolio" className="btn btn-secondary">Manage Portfolio</Link>
              <Link to="/earnings" className="btn btn-secondary">View Earnings</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default DeveloperDashboard