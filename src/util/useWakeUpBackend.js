// composables/useWakeUpBackend.js
export const useWakeUpBackend = () => {
  const pingBackend = async () => {
    try {
      await fetch('https://backmessanger.onrender.com/api/ping', { cache: 'no-store' })
      console.log('🌞 Backend is awake!')
    } catch (error) {
      console.warn('❌ Failed to wake up backend:', error)
    }
  }

  return { pingBackend }
}
