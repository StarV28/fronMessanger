<template>
  <div class="page__image">
    <img :src="preview || '/default-avatar.webp'" alt="Avatar User" />
  </div>
  <form @submit.prevent="onSubmit" class="form">
    <label>
      Choose your photo
      <Field name="avatar" v-slot="{ field, meta }">
        <input type="file" accept="image/*" @change="(e) => handleFileChange(e, field)" />
        <div v-if="meta.touched && meta.invalid" class="error">Invalid image</div>
      </Field>
    </label>
    <button type="submit" class="form__btn">Upload</button>
  </form>
  <button class="form__btn" @click="onBack" type="button">Back</button>
</template>

<script setup>
import { Field, useForm } from 'vee-validate'
import { ref, defineEmits } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'
//========================================================================================================================================================
const authStore = useAuthStore()
const userStore = useUserStore()
const file = ref(null)
const preview = ref(null)
const emit = defineEmits(['avatar-updated'])

const { handleSubmit } = useForm()
//========================================================================================================================================================
const onBack = () => {
  emit('avatar-updated')
}
//========================================================================================================================================================

const handleFileChange = (e, field) => {
  const selected = e.target.files[0]
  if (!selected) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
    alert('Invalid file type')
    return
  }

  file.value = selected
  preview.value = URL.createObjectURL(selected)
  field.value = selected
}
//========================================================================================================================================================

const onSubmit = handleSubmit(async () => {
  if (!file.value) {
    alert('No file selected')
    return
  }
  const user = JSON.parse(localStorage.getItem('user'))
  console.log('user', user)
  const userID = user._id

  const formData = new FormData()
  formData.append('avatar', file.value)
  formData.append('userID', userID)

  try {
    const result = await userStore.avatarEdit(formData)
    if (!result) {
      alert('Error change Avatar')
    }
    authStore.setUser(result.user)
    window.location.reload()

    emit('avatar-updated')
  } catch (err) {
    console.error('Upload failed:', err)
    alert('Upload failed')
  }
})
</script>
<style scoped>
.form,
.form label {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.page__image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
}
.form__btn {
  padding: 5px 10px;
  background-color: blueviolet;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
