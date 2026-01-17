import { useState, useEffect } from 'react'
import { getUserProfile, getProjects, applyToProject } from '../services/api'
import Navbar from './Navbar'
import './Dashboard.css'

const ProjectBrowser = () => {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedBudget: '',
    timeline: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResult = await getUserProfile()
        if (userResult.user) {
          setUser(userResult.user)
        }
        
        const projectsResult = await getProjects()
        if (projectsResult.projects) {
          setProjects(projectsResult.projects)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatBudget = (min, max) => {
    if (min === max) return `$${min}`
    return `$${min} - $${max}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleApplyClick = (project) => {
    setSelectedProject(project)
    setApplicationData({
      coverLetter: '',
      proposedBudget: project.budget_min || '',
      timeline: project.estimated_duration || ''
    })
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await applyToProject(selectedProject.id, applicationData)
      if (result.message) {
        alert('Application submitted successfully!')
        setSelectedProject(null)
        setApplicationData({ coverLetter: '', proposedBudget: '', timeline: '' })
      }
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <div>Please login to continue</div>

  return (
    <div>
      <Navbar user={user} />
      <div className="dashboard-container">
        <div className="profile-header">
          <h1>Browse Projects</h1>
          <p>Find projects that match your skills</p>
        </div>

        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p className="description">{project.description}</p>
                <div className="project-meta">
                  <span className="budget">{formatBudget(project.budget_min, project.budget_max)}</span>
                  <span className="category">{project.category}</span>
                  <span className="complexity">{project.complexity}</span>
                </div>
                <div className="skills">
                  {project.tech_stack && project.tech_stack.map(tech => (
                    <span key={tech} className="skill-tag">{tech}</span>
                  ))}
                </div>
                <p>Duration: {project.estimated_duration}</p>
                <p>Posted: {formatDate(project.created_at)}</p>
                <div className="project-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleApplyClick(project)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No projects available at the moment.</p>
            </div>
          )}
        </div>

        {/* Application Modal */}
        {selectedProject && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Apply to: {selectedProject.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleApplicationSubmit} className="application-form">
                <div className="form-group">
                  <label>Cover Letter *</label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    placeholder="Explain why you're the perfect fit for this project..."
                    required
                    rows="6"
                  />
                </div>
                
                <div className="form-group">
                  <label>Proposed Budget ($)</label>
                  <input
                    type="number"
                    value={applicationData.proposedBudget}
                    onChange={(e) => setApplicationData({...applicationData, proposedBudget: e.target.value})}
                    placeholder="Your proposed budget"
                  />
                </div>
                
                <div className="form-group">
                  <label>Estimated Timeline</label>
                  <input
                    type="text"
                    value={applicationData.timeline}
                    onChange={(e) => setApplicationData({...applicationData, timeline: e.target.value})}
                    placeholder="e.g., 2 weeks"
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Submit Application
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setSelectedProject(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectBrowser