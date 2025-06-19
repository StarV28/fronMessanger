import * as yup from 'yup'

export const registerSchema = yup.object({
  name: yup.string().required('Nickname is required').min(3, 'Minimum 3 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(3, 'Minimum 6 characters'),
})
