import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token if exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const auth = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (name, email, password, recaptchaToken) => API.post('/auth/register', { name, email, password, recaptchaToken })
}

export const posts = {
  list: (params) => API.get('/posts', { params }),
  getBySlug: (slug) => API.get(`/posts/${slug}`),
  create: (formData) => API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => API.delete(`/posts/${id}`)
}

export const comments = {
  byPost: (postId) => API.get(`/comments/post/${postId}`),
  create: (payload) => API.post('/comments', payload)
}

export const newsletter = {
  subscribe: (email, recaptchaToken) => API.post('/newsletter/subscribe', { email, recaptchaToken })
}

export default API
