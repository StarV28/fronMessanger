<template>
  <div class="wrapper">
    <header v-if="mob" class="header">
      <div class="header__user">
        <p>{{ authStore.user.name }}</p>
        <div class="header__img">
          <img :src="authStore.getAvatarUrl(authStore.user?.avatar)" alt="" />
        </div>
      </div>
      <button @click="openSidebar" class="header__open-btn">Open</button>
    </header>

    <div class="sidebar" :class="{ 'sidebar--active': isSidebarOpen }" v-if="mob">
      <users-comp @select-user="handleUserSelect" />
    </div>

    <users-comp v-else class="sidebar" @select-user="handleUserSelect" />

    <chat-comp class="chat" :selectedUser="selectedUser" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ChatComp from '../components/ChatComp.vue'
import UsersComp from '../components/UsersComp.vue'
import { useWidthScreen } from '../util/dynamicScreenWidth'
import { useAuthStore } from '../stores/authStore'
//========================================================================================================================================================
const selectedUser = ref(null)
const mob = ref(false)
const isSidebarOpen = ref(false)
const authStore = useAuthStore()
const { windowWidth } = useWidthScreen()
//========================================================================================================================================================

function handleUserSelect(user) {
  selectedUser.value = user
  if (mob.value) isSidebarOpen.value = false
}
//========================================================================================================================================================

const openSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
//========================================================================================================================================================

onMounted(() => {
  mob.value = windowWidth.value < 768
})
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: flex;
}
.sidebar {
  width: 35%;
  box-shadow: 2px 2px 5px rgba(219, 218, 218, 0.657);
  transition: all 0.3s ease-in-out;
  z-index: 10;
  background-color: #fff;
}
.chat {
  position: relative;
  width: 64%;
  height: 100vh;
  padding: 15px 25px;
}

@media (min-width: 768px) {
  .header {
    display: none;
  }
}

@media (max-width: 768px) {
  .wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    overflow: hidden;
  }
  .header {
    padding: 15px 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: start;
    justify-content: center;
    height: 20vh;
  }
  .header__user {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;

    p {
      font-size: 18px;
      font-weight: 700;
      text-transform: capitalize;
      line-height: 1.3;
      color: purple;
    }
  }
  .header__img {
    position: relative;
    width: 50px;
    padding-bottom: 50px;
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
  .header__open-btn {
    width: 100%;
    padding: 7px 15px;
    background-color: purple;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }
  .sidebar {
    position: absolute;
    top: 0;
    left: -100%; // по умолчанию скрыт
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
  }

  .sidebar--active {
    left: 0;
    opacity: 1;
    visibility: visible;
  }

  .chat {
    width: 100%;
    height: 80vh;
    overflow: hidden;
  }
}
</style>
