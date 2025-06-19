// src/utils/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backmessanger.onrender.com/api/v1', // path to backend
  // baseURL: 'http://localhost:3000/api/v1', // path to backend
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default api
