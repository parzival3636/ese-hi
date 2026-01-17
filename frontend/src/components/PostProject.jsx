import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

const PostProject = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
    budget: '',
    timeline: '',
    complexity: '',
    projectType: 'fixed',
    deliverables: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // TODO: Add API call to post project
      setMessage('Project posted successfully!')
      setTimeout(() => {
        navigate('/dashboard/company')
      }, 2000)
    } catch (error) {
      setMessage('Failed to post project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  return (
    <div className="auth-container post-project">
      <div className="auth-form">
        <h2>Post a New Project</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Project Details</h3>
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            
            <textarea
              name="description"
              placeholder="Project Description (Be specific about requirements)"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
            
            <div className="form-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="ui-ux-design">UI/UX Design</option>
                <option value="data-science">Data Science</option>
                <option value="devops">DevOps</option>
                <option value="other">Other</option>
              </select>
              
              <select
                name="complexity"
                value={formData.complexity}
                onChange={handleChange}
                required
              >
                <option value="">Complexity Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <textarea
              name="skills"
              placeholder="Required Skills (e.g., React, Node.js, Python)"
              value={formData.skills}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>

          <div className="form-section">
            <h3>Budget & Timeline</h3>
            <div className="form-row">
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
              
              <input
                type="text"
                name="budget"
                placeholder="Budget Range (e.g., $1000-$3000)"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
            
            <input
              type="text"
              name="timeline"
              placeholder="Project Timeline (e.g., 2-4 weeks)"
              value={formData.timeline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <h3>Deliverables</h3>
            <textarea
              name="deliverables"
              placeholder="Expected Deliverables (What should be delivered?)"
              value={formData.deliverables}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting Project...' : 'Post Project'}
          </button>
        </form>
        
        <Link to="/dashboard/company" className="back-home">← Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default PostProject