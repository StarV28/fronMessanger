<!-- src/views/AuthSuccess.vue -->
<template>
  <div class="wrapper">
    <loader-comp v-if="loading" />
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const error = ref(null)
const loading = ref(true)
const router = useRouter()
const authStore = useAuthStore()
//========================================================================================================================================================
const openUserPage = async () => {
  loading.value = true
  try {
    const result = await authStore.googleLogin()
    console.log('result google', result)
    if (!result || !result.user) {
      error.value = 'Google login failed'
      return router.push('/login')
    } else {
      router.push('/user')
      return result
    }
  } catch (err) {
    console.error(err)
    error.value = 'Error Authorization'
    router.push('/login')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await openUserPage()
})
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
