import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  let userData = null
  const storedUser = localStorage.getItem('user')
  const storeToken = localStorage.getItem('jwt')

  try {
    userData = storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.warn('Error parsing user from localStorage:', error)
    localStorage.removeItem('user')
  }

  const user = ref(userData)
  const token = ref(storeToken)
  //========================================================================================================================================================

  const error = ref(null)
  const loading = ref(false)
  const baseUrl = 'https://backmessanger.onrender.com/api/v1'
  // const baseUrl = 'http://localhost:3000/api/v1'
  //========================================================================================================================================================

  const register = async (data) => {
    loading.value = true
    try {
      const response = await api.post('auth/register', data)
      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('jwt', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = err.response?.data?.message || 'Register failed'
    } finally {
      loading.value = false
    }
  }
  //========================================================================================================================================================

  const login = async (data) => {
    loading.value = true
    try {
      const response = await api.post('auth/login', data)

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem('jwt', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }
  //========================================================================================================================================================

  const googleLogin = async () => {
    loading.value = true
    try {
      const response = await api.get('auth/me', { withCredentials: true })

      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('jwt', token.value)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }
  //========================================================================================================================================================

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  //========================================================================================================================================================

  const getAvatarUrl = (avatarPath) => {
    const baseUrlAvatar = 'https://backmessanger.onrender.com'
    // const baseUrlAvatar = 'http://localhost:3000'
    if (!avatarPath) {
      return '/default-avatar.webp'
    }
    const isExternal = /^https?:\/\//i.test(avatarPath)
    return isExternal ? avatarPath : `${baseUrlAvatar}${avatarPath}`
  }
  //========================================================================================================================================================

  const setUser = (newUser) => {
    console.log('newUser', newUser)
    if (!newUser) {
      clearUser()
      return
    }
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }
  //========================================================================================================================================================

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    setUser,
    clearUser,
    token,
    error,
    loading,
    register,
    login,
    logout,
    googleLogin,
    baseUrl,
    getAvatarUrl,
  }
})
