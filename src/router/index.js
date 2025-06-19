import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, isRouteAvailable } from './helper/authRouter'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserView from '@/views/UserView.vue'
import AuthSuccess from '@/components/AuthSuccess.vue'
import ChatView from '@/components/ChatComp.vue'
import UsersComp from '@/components/UsersComp.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '/chat',
        name: 'chat',
        component: ChatView,
      },
      {
        path: 'users',
        name: 'users',
        component: UsersComp,
      },
    ],
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/auth/success',
    name: 'AuthSuccess',
    component: AuthSuccess,
    meta: {
      requireAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta?.requireAuth) {
    if (!isAuthenticated())
      return {
        name: 'login',
      }
    if (!isRouteAvailable(to)) {
      return {
        name: 'page-not-found',
      }
    }
  }
})

export default router
