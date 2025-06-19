<template name="fade">
  <div v-if="!selectedUser" class="load">
    <img src="/load-main.jpg" alt="" />
  </div>
  <div v-else class="wrapper">
    <h2>
      💬 Messages with <span>{{ props.selectedUser.name }}</span>
    </h2>
    <ul class="chat__list">
      <li
        v-for="(msg, index) in allMessages"
        :key="msg._id || index"
        class="chat__item"
        :class="{ 'chat__item--me': msg.from?.id === authStore.user._id }"
      >
        <span>{{ msg.from?.name || 'You' }}:</span> {{ msg.text }}
      </li>
    </ul>
    <div class="chat__form form">
      <input class="form__inp" v-model="text" placeholder="Message..." />
      <button class="form__btn" @click="sendTo(text)">Send</button>
    </div>
  </div>
</template>

<script setup>
//========================================================================================================================================================

import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useSocketStore } from '@/stores/socketStore'
import { useAuthStore } from '@/stores/authStore'
//========================================================================================================================================================

const props = defineProps({
  selectedUser: Object,
})

const authStore = useAuthStore()
const socketStore = useSocketStore()

const text = ref('')
const user = ref(null)
const allMessages = ref([])
//========================================================================================================================================================
// 📥 При получении нового сообщения через WebSocket добавим его в список сообщений
function handleIncomingMessage(msg) {
  const isRelated = msg.from?.id === props.selectedUser?._id || msg.to === props.selectedUser?._id

  if (isRelated) {
    allMessages.value.push({
      _id: msg.timestamp,
      from: msg.from,
      text: msg.text,
      createdAt: new Date(msg.timestamp),
    })
  }
}

//========================================================================================================================================================
// 🔄 Подгрузка истории при смене собеседника
watch(
  () => props.selectedUser,
  async (newUser) => {
    if (!newUser) return
    const history = await socketStore.loadChatHistory(newUser._id)
    allMessages.value = history.map(normalizeMessage)
  },
  { immediate: true },
)

//========================================================================================================================================================

function sendTo() {
  if (!text.value.trim() || !props.selectedUser) return

  socketStore.sendMessage({
    type: 'message',
    toUserId: props.selectedUser._id,
    text: text.value,
  })

  text.value = ''
}
//========================================================================================================================================================

function normalizeMessage(msg) {
  return {
    _id: msg._id || msg.timestamp,
    from: typeof msg.from === 'object' ? msg.from : { name: 'You' },
    text: msg.text,
    createdAt: new Date(msg.createdAt || msg.timestamp || Date.now()),
  }
}

//========================================================================================================================================================
// 📌 Подписка на сокет при монтировании компонента
onMounted(async () => {
  const token = localStorage.getItem('jwt')
  user.value = authStore.user
  if (token) {
    socketStore.connect(token)
    // Подписываемся сразу после подключения
    socketStore.onMessage(handleIncomingMessage)
  }

  // Загружаем историю выбранного пользователя (если есть)
  if (props.selectedUser) {
    const history = await socketStore.loadChatHistory(props.selectedUser._id)
    console.log('history', history)
    allMessages.value = history.map(normalizeMessage)
  }
})

// ❌ Очистка при размонтировании
onUnmounted(() => {
  socketStore.offMessage(handleIncomingMessage)
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.load {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%; // важно!
  flex: 1;
  overflow: hidden;

  h2 {
    margin-bottom: 10px;
    span {
      color: purple;
      font-size: 26px;
      font-weight: 700;
      text-transform: capitalize;
    }
  }
}

.chat__list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px;
}

.chat__item {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.5;

  span {
    text-transform: capitalize;
    font-size: 14px;
    line-height: 1.3;
  }
}
.chat__item {
  max-width: 60%;
  margin: 4px 0;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f1f1f1;
  align-self: flex-start;
}

.chat__item--me {
  background: #dcf8c6;
  align-self: flex-end;
  margin-left: auto;
}

.chat__form {
  display: flex;
  justify-content: space-between;
  gap: 3px;
}
.form__inp {
  width: 100%;
  padding: 7px;
  border: 1px solid;
}
.form__btn {
  padding: 7px 10px;
  background-color: rgb(137, 43, 226);
  color: #fff;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
}
</style>
