import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'

const Profile = () => {
  const [userType] = useState('developer') // This would come from auth context
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    country: 'United States',
    city: 'New York',
    title: 'Full Stack Developer',
    bio: 'Experienced developer with 5+ years in web development',
    hourlyRate: '50',
    skills: 'React, Node.js, Python, MongoDB',
    portfolio: 'https://johndoe.dev',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe'
  })
  const [editing, setEditing] = useState(false)

  const handleChange = (e) => {
    setProfile({...profile, [e.target.name]: e.target.value})
  }

  const handleSave = () => {
    // TODO: Save to backend
    setEditing(false)
  }

  return (
    <div className="auth-container profile">
      <div className="auth-form">
        <div className="profile-header">
          <h2>My Profile</h2>
          <button 
            className="btn btn-secondary"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="profile-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!editing}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
            />
            
            <div className="form-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={profile.country}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {userType === 'developer' && (
            <>
              <div className="form-section">
                <h3>Professional Details</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Professional Title"
                  value={profile.title}
                  onChange={handleChange}
                  disabled={!editing}
                />
                
                <textarea
                  name="bio"
                  placeholder="Professional Bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  disabled={!editing}
                />
                
                <input
                  type="number"
                  name="hourlyRate"
                  placeholder="Hourly Rate ($)"
                  value={profile.hourlyRate}
                  onChange={handleChange}
                  disabled={!editing}
                />
                
                <textarea
                  name="skills"
                  placeholder="Skills"
                  value={profile.skills}
                  onChange={handleChange}
                  rows="2"
                  disabled={!editing}
                />
              </div>

              <div className="form-section">
                <h3>Portfolio & Links</h3>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="Portfolio Website"
                  value={profile.portfolio}
                  onChange={handleChange}
                  disabled={!editing}
                />
                
                <div className="form-row">
                  <input
                    type="url"
                    name="github"
                    placeholder="GitHub Profile"
                    value={profile.github}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="LinkedIn Profile"
                    value={profile.linkedin}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
            </>
          )}

          {editing && (
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
        
        <Link to={`/dashboard/${userType}`} className="back-home">← Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default Profile