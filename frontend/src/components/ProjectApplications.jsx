import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserProfile, getProjectApplications } from '../services/api'
import Navbar from './Navbar'
import './Dashboard.css'

const ProjectApplications = () => {
  const { projectId } = useParams()
  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResult = await getUserProfile()
        if (userResult.user) {
          setUser(userResult.user)
        }
        
        const applicationsResult = await getProjectApplications(projectId)
        if (applicationsResult.applications) {
          setApplications(applicationsResult.applications)
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50' // Green
    if (score >= 60) return '#FF9800' // Orange
    return '#f44336' // Red
  }

  const handleAssignProject = (applicationId) => {
    // TODO: Implement project assignment
    console.log('Assigning project to application:', applicationId)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <div>Please login to continue</div>

  return (
    <div>
      <Navbar user={user} />
      <div className="dashboard-container">
        <div className="profile-header">
          <h1>Project Applications</h1>
          <Link to="/dashboard/company/my-projects" className="btn btn-secondary">
            Back to My Projects
          </Link>
        </div>

        <div className="applications-list">
          {applications.length > 0 ? (
            applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <h3>{application.developer_email}</h3>
                  <div className="ml-score" style={{ color: getScoreColor(application.matching_score) }}>
                    ML Score: {application.matching_score}%
                  </div>
                </div>
                
                <div className="application-details">
                  <p><strong>Proposed Budget:</strong> ${application.proposed_budget}</p>
                  <p><strong>Timeline:</strong> {application.estimated_timeline}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${application.status}`}>
                      {application.status}
                    </span>
                  </p>
                </div>

                <div className="cover-letter">
                  <h4>Cover Letter:</h4>
                  <p>{application.cover_letter}</p>
                </div>

                <div className="application-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAssignProject(application.id)}
                    disabled={application.status !== 'pending'}
                  >
                    Assign Project
                  </button>
                  <button className="btn btn-secondary">
                    View Profile
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No applications yet for this project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectApplications