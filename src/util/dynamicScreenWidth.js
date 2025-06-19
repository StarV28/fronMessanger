import { ref, onMounted, onUnmounted } from 'vue'

export function useWidthScreen() {
  const windowWidth = ref(window.innerWidth)

  function updateWidth() {
    windowWidth.value = window.innerWidth
  }
  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })
  return { windowWidth }
}
