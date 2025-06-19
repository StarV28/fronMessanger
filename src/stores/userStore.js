import api from '../plugins/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('editUser', () => {
  const error = ref(null)
  const loading = ref(false)
  const authStore = useAuthStore()

  const avatarEdit = async (data) => {
    loading.value = true
    try {
      const response = await api.post('user/avatar', data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error Edit avatar'
    } finally {
      loading.value = false
    }
  }

  const userDateEdit = async (data) => {
    loading.value = true
    try {
      const response = await api.post('user/edit', data)
      authStore.setUser(response.data)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error edit user '
    } finally {
      loading.value = false
    }
  }

  return {
    error,
    avatarEdit,
    loading,
    userDateEdit,
  }
})
