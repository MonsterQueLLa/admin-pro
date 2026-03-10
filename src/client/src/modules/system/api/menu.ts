import request from '@/utils/request'

export interface Menu {
  _id: string
  name: string
  path: string
  component: string
  icon: string
  type: 'directory' | 'menu' | 'button'
  permission: string
  parentId: string | null
  children?: Menu[]
}

// 获取菜单树
export const getMenuTreeApi = () => {
  return request.get<Menu[]>('/menus/tree')
}

// 获取当前用户菜单
export const getUserMenusApi = () => {
  return request.get<Menu[]>('/menus/user')
}

// 创建菜单
export const createMenuApi = (data: Partial<Menu>) => {
  return request.post('/menus', data)
}

// 更新菜单
export const updateMenuApi = (id: string, data: Partial<Menu>) => {
  return request.put(`/menus/${id}`, data)
}

// 删除菜单
export const deleteMenuApi = (id: string) => {
  return request.delete(`/menus/${id}`)
}
