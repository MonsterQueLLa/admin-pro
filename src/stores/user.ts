// Pinia Store 示例
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info: any) => {
    userInfo.value = info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout
  }
})
