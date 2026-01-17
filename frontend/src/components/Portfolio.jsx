import { useState, useEffect } from 'react'
import { getUserProfile } from '../services/api'
import Navbar from './Navbar'
import './Dashboard.css'

const Portfolio = () => {
  const [user, setUser] = useState(null)
  const [portfolioItems, setPortfolioItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    image: null
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserProfile()
        if (result.user) {
          setUser(result.user)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) return

    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      image: formData.image ? URL.createObjectURL(formData.image) : '/pexels-fauxels-3183202.jpg'
    }

    setPortfolioItems(prev => [...prev, newProject])
    setFormData({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      image: null
    })
    setShowAddForm(false)
  }

  return (
    <div className="dashboard-container">
      <div className="profile-header">
        <h1>My Portfolio</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-portfolio-form">
          <h3>Add New Project</h3>
          <form onSubmit={handleAddProject}>
            <div className="form-row">
              <input 
                type="text" 
                name="title"
                placeholder="Project Title" 
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <input 
                type="text" 
                name="technologies"
                placeholder="Technologies (comma separated)" 
                value={formData.technologies}
                onChange={handleInputChange}
              />
            </div>
            <textarea 
              name="description"
              placeholder="Project Description" 
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <div className="form-row">
              <input 
                type="url" 
                name="liveUrl"
                placeholder="Live Demo URL" 
                value={formData.liveUrl}
                onChange={handleInputChange}
              />
              <input 
                type="url" 
                name="githubUrl"
                placeholder="GitHub URL" 
                value={formData.githubUrl}
                onChange={handleInputChange}
              />
            </div>
            <input 
              type="file" 
              name="image"
              accept="image/*" 
              onChange={handleInputChange}
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Project</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}}

      <div className="portfolio-grid">
        {portfolioItems.length > 0 ? (
          portfolioItems.map(item => (
            <div key={item.id} className="portfolio-card">
              <img src={item.image} alt={item.title} />
              <div className="portfolio-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="technologies">
                  {item.technologies.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="portfolio-links">
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Live Demo
                  </a>
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No portfolio projects yet. Add your first project to showcase your work!</p>
          </div>
        )}
      </div>

      <Link to="/dashboard/developer" className="back-link">← Back to Dashboard</Link>
    </div>
  )
}

export default Portfolio