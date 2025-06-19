import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../plugins/axios'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const router = useRouter()
  const listeners = new Set()
  const unreadUsers = ref([])
  const token = localStorage.getItem('jwt')
  //=====================================================================================

  function connect(token) {
    if (socket.value && isConnected.value) return

    socket.value = new WebSocket('wss://backmessanger.onrender.com/ws', [token])
    // socket.value = new WebSocket('ws://localhost:3000/ws', [token])

    socket.value.onopen = () => {
      isConnected.value = true
      console.log('🟢 WebSocket connected')
    }

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        listeners.forEach((cb) => cb(data))
      } catch (err) {
        console.error('Ошибка обработки сообщения:', err)
      }
    }

    socket.value.onerror = (err) => {
      console.error('❗ WebSocket error:', err)
      handleDisconnect()
    }

    socket.value.onclose = () => {
      console.warn('🔌 WebSocket disconnected')
      handleDisconnect()
    }
  }

  //=====================================================================================

  function handleDisconnect() {
    isConnected.value = false
    socket.value = null
    localStorage.removeItem('jwt')
    router.push('/login')
  }

  //=====================================================================================

  function sendMessage(payload) {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(payload))
    } else {
      console.warn('⚠️ WebSocket не подключён')
    }
  }

  //=====================================================================================

  async function loadChatHistory(id) {
    try {
      const result = await api.get(`/messages/${id}`)
      return result.data
    } catch (err) {
      console.error('❌ Ошибка загрузки чата:', err)
      return []
    }
  }
  //========================================================================================================================================================
  async function fetchUnreadList() {
    try {
      const res = await api.get('/messages/unread/list')
      unreadUsers.value = res.data.map((item) => ({
        user: item.user,
        count: item.count,
      }))
    } catch (e) {
      console.error('Ошибка при получении списка непрочитанных', e)
    }
  }
  //========================================================================================================================================================
  const readMessageUser = async (fromUserId) => {
    try {
      await api.patch(`/messages/read/${fromUserId}`)
    } catch (err) {
      console.error('Error read message send', err)
    }
  }
  //=====================================================================================

  function onMessage(callback) {
    listeners.add(callback)
  }

  function offMessage(callback) {
    listeners.delete(callback)
  }

  return {
    socket,
    isConnected,
    connect,
    sendMessage,
    loadChatHistory,
    onMessage,
    offMessage,
    unreadUsers,
    fetchUnreadList,
    readMessageUser,
    token,
  }
})
