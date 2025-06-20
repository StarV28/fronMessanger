<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWakeUpBackend } from './util/useWakeUpBackend'

onMounted(() => {
  const { pingBackend } = useWakeUpBackend()
  pingBackend()
})
</script>

<style lang="scss" scoped></style>
