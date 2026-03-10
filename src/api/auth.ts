import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: {
    id: number
    username: string
    avatar: string
  }
}

// 登录
export const login = (data: LoginParams) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get('/auth/userinfo')
}

// 登出
export const logout = () => {
  return request.post('/auth/logout')
}
