import request from '@/utils/request'

export interface User {
  id: number
  username: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  createTime: string
}

export interface UserParams {
  page?: number
  pageSize?: number
  username?: string
  email?: string
  status?: string
}

// 获取用户列表
export const getUserList = (params: UserParams) => {
  return request.get<{ list: User[]; total: number }>('/users', { params })
}

// 创建用户
export const createUser = (data: Partial<User>) => {
  return request.post('/users', data)
}

// 更新用户
export const updateUser = (id: number, data: Partial<User>) => {
  return request.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`)
}
