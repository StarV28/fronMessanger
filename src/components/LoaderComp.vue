<template>
  <div class="text-center">
    <v-progress-circular :model-value="value" :rotate="360" :size="100" :width="15" color="teal">
      <template v-slot:default> {{ value }} % </template>
    </v-progress-circular>
  </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const value = ref(0)

let interval = -1
onMounted(() => {
  interval = setInterval(() => {
    if (value.value === 100) {
      return (value.value = 0)
    }
    value.value += 1
  }, 100)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>
<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
