<template>
  <loader-comp v-if="authStore.loading" />
  <div v-else class="wrapper">
    <form @submit.prevent="onSubmit" class="form">
      <h1>Registration</h1>
      <div class="form__inp">
        <label> Enter your Nickname </label>
        <Field type="text" name="name" />
        <ErrorMessage name="name" class="error" />
      </div>
      <div class="form__inp">
        <label> Enter your E-mail </label>
        <Field type="text" name="email" />
        <ErrorMessage name="email" class="error" />
      </div>
      <div class="form__inp">
        <label> Enter your Password </label>
        <Field type="password" name="password" />
        <ErrorMessage name="password" class="error" />
      </div>
      <button class="form__btn-submit" type="submit" :disabled="!meta.valid">
        Registration with E-mail
      </button>
    </form>
  </div>
</template>

<script setup>
import { ErrorMessage, useForm, Field } from 'vee-validate'
import { registerSchema } from '../validate/registerSchema'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
//========================================================================================================================================================
const authStore = useAuthStore()
const router = useRouter()
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: registerSchema,
})
//========================================================================================================================================================
const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register(values)
    if (authStore.error) {
      alert('Incorrect email or password.')
      return
    }
    resetForm()
    router.push('/user')
  } catch (err) {
    alert('Server may be sleeping. Try again shortly.')
    console.error('Registration error:', err)
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  box-shadow: 3px 3px 5px 5px rgba(137, 43, 226, 0.38);
  padding: 15px 25px;
  h1 {
    font-size: 34px;
    font-weight: 700;
    line-height: 1.1;
    color: rgb(35, 33, 33);
  }
}
.form__inp {
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  justify-content: center;

  label {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
  }

  input {
    width: 100%;
    padding: 15px 15px;
    box-shadow: 3px 3px 5px rgba(137, 43, 226, 0.38);
    border: 1px solid blueviolet;
  }
}
.form__btn-submit {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  box-shadow: 3px 3px 5px rgba(137, 43, 226, 0.38);
  background-color: #fff;
  border: none;
  text-decoration: none;
  color: rgba(56, 56, 112, 0.86);
  cursor: pointer;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
    transform: scale(1.03);
    box-shadow: 2px 2px 3px 3px rgba(137, 43, 226, 0.703);
  }
  &:disabled {
    transform: scale(1);
    box-shadow: 3px 3px 5px rgba(137, 43, 226, 0.38);
  }
}
.error {
  font-style: italic;
  font-weight: 500;
  color: red;
}
</style>
