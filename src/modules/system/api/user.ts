import request from '@/utils/request'

export interface User {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  roles: { id: string; name: string; code: string }[]
  createdAt: string
}

export interface UserParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface CreateUserData {
  username: string
  password: string
  nickname?: string
  email?: string
  phone?: string
  roleIds?: string[]
  status?: number
}

// 获取用户列表
export const getUserListApi = (params: UserParams) => {
  return request.get<{ list: User[]; pagination: any }>('/users', { params })
}

// 创建用户
export const createUserApi = (data: CreateUserData) => {
  return request.post('/users', data)
}

// 更新用户
export const updateUserApi = (id: string, data: Partial<CreateUserData>) => {
  return request.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUserApi = (id: string) => {
  return request.delete(`/users/${id}`)
}

// 重置密码
export const resetPasswordApi = (id: string, password: string) => {
  return request.put(`/users/${id}/reset-password`, { password })
}
