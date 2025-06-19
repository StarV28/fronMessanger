<template>
  <div class="wrapper">
    <header class="header">
      <span>User</span>
      <router-link :to="{ name: 'user' }" class="header__box-user">
        <p>{{ authStore.user.name }}</p>
        <div class="header__image">
          <img :src="authStore.getAvatarUrl(authStore.user.avatar)" alt="" />
        </div>
      </router-link>
    </header>
    <main class="main">
      <div class="main__title">
        <h2>User List</h2>
      </div>
      <ul class="main__list">
        <li
          @click="onSelectUser(user)"
          class="main__item item"
          v-for="user in usersWithUnread"
          :key="user._id"
        >
          <span class="item__name">{{ user.name }}</span>

          <span v-if="user.unreadCount > 0" class="unread-count">
            {{ user.unreadCount }}
          </span>
          <span v-if="onlineUsers.includes(user._id)" class="online-indicator">🟢</span>
          <span v-else class="offline-indicator">⚪</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useUsersStore } from '../stores/usersStore'
import { useSocketStore } from '@/stores/socketStore'
import { onMounted, onUnmounted, ref, computed, defineEmits } from 'vue'
//========================================================================================================================================================
const authStore = useAuthStore()
const usersStore = useUsersStore()
const socketStore = useSocketStore()
const onlineUsers = ref([])
const users = ref([])

const emit = defineEmits(['select-user'])
//========================================================================================================================================================
const usersList = async () => {
  const list = await usersStore.getUsersList()
  if (!usersList) {
    return (users.value = [])
  }
  users.value = list.data.filter((user) => user._id !== authStore.user._id)
}
//========================================================================================================================================================
const unreadMap = computed(() => {
  const map = new Map()
  socketStore.unreadUsers.forEach(({ user, count }) => {
    if (user && user._id) {
      map.set(user._id, count)
    }
  })
  return map
})

const usersWithUnread = computed(() => {
  return users.value.map((user) => ({
    ...user,
    unreadCount: unreadMap.value.get(user._id) || 0,
  }))
})
//========================================================================================================================================================
const onSelectUser = async (user) => {
  emit('select-user', user)
  try {
    socketStore.readMessageUser(user._id)
    socketStore.fetchUnreadList()
  } catch (err) {
    console.error('Ошибка при отметке как прочитанное:', err)
  }
}
//========================================================================================================================================================

function handleOnlineUsers(msg) {
  if (msg.type === 'online_users') {
    onlineUsers.value = msg.userIds
  }
}

//========================================================================================================================================================
onMounted(async () => {
  usersList()
  const token = localStorage.getItem('jwt')
  if (token) {
    socketStore.connect(token)
    socketStore.onMessage(handleOnlineUsers)
    socketStore.fetchUnreadList()
  }
})
onUnmounted(() => {
  socketStore.offMessage(handleOnlineUsers.value)
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
}
.header {
  width: 100%;
  padding: 15px 25px;
  box-shadow: 2px 2px 5px rgba(219, 218, 218, 0.657);
  display: flex;
  flex-direction: column;
  gap: 10px;

  span {
    font-size: 21px;
    line-height: 1.2;
    font-weight: 700;
  }
}
.header__box-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  p {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    color: purple;
    text-transform: capitalize;
  }
}
.header__image {
  position: relative;
  width: 50px;
  padding-bottom: 50px;
  border-radius: 50%;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: start;
  justify-content: center;
  padding: 15px;
}
.main__title {
  h2 {
    font-size: 21px;
    line-height: 1.3;
    font-weight: 500;
  }
}
.main__list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 15px;
  list-style: none;
}
.main__item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-direction: column;
  // align-items: start;
  // justify-content: center;
  gap: 7px;
  border-bottom: 1px solid rgba(219, 218, 218, 0.657);
  cursor: pointer;
}
.item__name {
  font-size: 18px;
  line-height: 1.5;
  font-weight: 500;
  color: purple;
}
.item__email {
  padding-left: 15px;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 300;
}
.unread-count {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
}
</style>
