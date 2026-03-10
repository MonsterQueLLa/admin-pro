import request from '@/core/utils/request'

export interface Role {
  _id: string
  name: string
  code: string
  description: string
  permissions: string[]
  dataScope: string
  status: number
}

// 获取角色列表
export const getRoleListApi = () => {
  return request.get<Role[]>('/roles')
}

// 创建角色
export const createRoleApi = (data: Partial<Role>) => {
  return request.post('/roles', data)
}

// 更新角色
export const updateRoleApi = (id: string, data: Partial<Role>) => {
  return request.put(`/roles/${id}`, data)
}

// 删除角色
export const deleteRoleApi = (id: string) => {
  return request.delete(`/roles/${id}`)
}
