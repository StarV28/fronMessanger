<template>
  <loader-comp v-if="loading" />
  <div v-else class="page">
    <div v-if="!editAvatar" class="page__avatar">
      <div class="page__image">
        <img :src="authStore.getAvatarUrl(user?.avatar)" alt="Avatar User" />
      </div>
      <button @click="avatarEdit" class="page__edit-btn-img">Edit Avatar</button>
    </div>
    <FormEditAvatar v-if="editAvatar" @avatar-updated="editAvatar = false" />
    <loader-comp v-if="userStore.loading" />
    <form v-else @submit.prevent="onSubmit" class="page__data-user">
      <label class="page__item"
        >Nickname:
        <Field type="text" name="name" :disabled="!edit" />
        <ErrorMessage name="name" class="error" />
      </label>
      <label class="page__item"
        >E-mail:
        <Field type="text" name="email" :disabled="!edit" />
        <ErrorMessage name="email" class="error" />
      </label>
      <div class="page__btns">
        <button type="button" @click="onEdit">{{ !edit ? 'Edit' : 'Cancel' }}</button>
        <button :disabled="!edit" type="submit">Submit</button>
        <button type="button" @click="onLogout">Logout</button>
        <button type="button" @click="onChat">Chat</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'

import { useRouter } from 'vue-router'
import { ErrorMessage, useForm, Field } from 'vee-validate'
import { editUserSchema } from '../validate/editUserSchema'
import { onMounted, ref } from 'vue'
import FormEditAvatar from '../components/FormEditAvatar.vue'
//========================================================================================================================================================

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const user = ref(null)
const edit = ref(false)
const editAvatar = ref(false)
const loading = ref(null)

const { handleSubmit, setValues } = useForm({
  validationSchema: editUserSchema,
  initialValues: {
    name: '',
    email: '',
  },
})
//========================================================================================================================================================
const avatarEdit = () => {
  editAvatar.value = !editAvatar.value
}
//========================================================================================================================================================
const onEdit = () => {
  edit.value = !edit.value
}
//========================================================================================================================================================
const onChat = () => {
  router.push({ name: 'home' })
}
//========================================================================================================================================================
const onSubmit = handleSubmit(async (values) => {
  try {
    const id = user.value._id
    values._id = id
    await userStore.userDateEdit(values)
    window.location.reload()
  } catch (err) {
    console.error('Edit user', err)
  }
})
//========================================================================================================================================================

const onLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
//========================================================================================================================================================
onMounted(() => {
  loading.value = true
  try {
    user.value = authStore.user
    if (authStore.user) {
      setValues({
        name: authStore.user.name,
        email: authStore.user.email,
      })
    }
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page {
  padding: 50px 15px;
  display: flex;
  flex-direction: column;
  gap: 35px;
  justify-content: center;
  align-items: center;
}
.page__avatar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
}
.page__image {
  position: relative;
  width: 120px;
  padding-bottom: 120px;
  overflow: hidden;
  border-radius: 50%;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.page__edit-btn-img {
  padding: 2px 10px;
  border-radius: 5px;
  background-color: blueviolet;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
    transform: scale(1.03);
    box-shadow: 2px 2px 5px black;
  }
}
.page__data-user {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
}
.page__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  border-bottom: 1px solid blueviolet;

  input {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    padding: 5px 10px;
  }
}
.page__btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  button {
    padding: 5px 15px;
    border-radius: 5px;
    background-color: rgba(151, 147, 147, 0.786);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    transition: all 0.3s ease;
    &:hover {
      transition: all 0.3s ease;
      transform: scale(1.03);
      box-shadow: 2px 2px 5px blueviolet;
    }

    &:disabled {
      background-color: rgba(151, 147, 147, 0.252);
      transform: scale(1);
      box-shadow: 0 0 0;
      &:hover {
        background-color: rgba(151, 147, 147, 0.252);
        transform: scale(1);
        box-shadow: 0 0 0;
      }
    }
  }
}
.error {
  font-size: 16px;
  font-style: italic;
  color: red;
}
</style>
