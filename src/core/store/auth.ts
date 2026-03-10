import request from './utils/request'
import type { LoginParams, LoginResult } from './types'

// 登录
export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request.get('/auth/info')
}

// 登出
export const logoutApi = () => {
  return request.post('/auth/logout')
}
