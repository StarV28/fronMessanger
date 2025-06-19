import api from '../plugins/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

export const useUsersStore = defineStore('users', () => {
  const error = ref()
  const loading = ref(false)
  const users = ref(null)
  const authStore = useAuthStore()
  const token = authStore.token

  const getUsersList = async () => {
    loading.value = true
    try {
      const response = await api.get('/user/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Error List Users'
    } finally {
      loading.value = false
    }
  }

  return {
    error,
    loading,
    users,
    getUsersList,
    // readMessageUser,
  }
})
