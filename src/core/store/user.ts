import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, getUserInfoApi } from './auth'
import type { LoginParams, UserInfo } from './types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = () => !!token.value

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const login = async (params: LoginParams) => {
    const res = await loginApi(params)
    setToken(res.token)
    userInfo.value = res.user
    return res
  }

  const getUserInfo = async () => {
    const res = await getUserInfoApi()
    userInfo.value = res
    return res
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const hasPermission = (permission: string) => {
    if (!userInfo.value) return false
    if (userInfo.value.isAdmin) return true
    return userInfo.value.permissions.includes(permission)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    getUserInfo,
    logout,
    hasPermission
  }
})
