const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const registerDeveloper = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/developer/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  return response.json()
}

export const registerCompany = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/company/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  return response.json()
}

export const login = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  return response.json()
}