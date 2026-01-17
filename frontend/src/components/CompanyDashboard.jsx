import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUserProfile } from '../services/api'
import Navbar from './Navbar'
import './Dashboard.css'

const CompanyDashboard = () => {
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
              <Link to="/dashboard/company/post-project" className="view-all">Post a Project</Link>
            </section>

            <section className="recent-applications">
              <h2>Recent Applications</h2>
              <div className="application-list">
                <div className="empty-state">
                  <p>No applications yet. Post projects to start receiving applications from developers.</p>
                </div>
              </div>
              <Link to="/dashboard/company/post-project" className="view-all">Post Your First Project</Link>
            </section>
          </div>

          <aside className="sidebar">
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <Link to="/dashboard/company/post-project" className="btn btn-primary">Post New Project</Link>
              <Link to="/dashboard/company/my-projects" className="btn btn-secondary">Manage Projects</Link>
              <Link to="/dashboard/company/find-developers" className="btn btn-secondary">Find Developers</Link>
              <Link to="/dashboard/company/payments" className="btn btn-secondary">Payment History</Link>
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
    </div>
  )
}

export default CompanyDashboard