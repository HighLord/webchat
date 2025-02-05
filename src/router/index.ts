import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OnlineUsersView from '../views/OnlineUsersView.vue'
import ChatView from '../views/ChatView.vue'


const routes = [
  { path: '/', component: HomeView },
  { path: '/online-users', component: OnlineUsersView },
  { path: '/chat/:username', component: ChatView, props: true }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
