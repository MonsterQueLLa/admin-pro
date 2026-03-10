import { Menu } from '../models/menu.js'
import { response } from '../utils/response.js'

// 获取菜单树
export const getMenuTree = async (req, res) => {
  try {
    const menus = await Menu.find({ status: 1 }).sort({ sort: 1 })
    
    // 构建树形结构
    const buildTree = (parentId = null) => {
      return menus
        .filter(menu => String(menu.parentId) === String(parentId))
        .map(menu => ({
          ...menu.toObject(),
          children: buildTree(menu._id)
        }))
    }
    
    const tree = buildTree()
    response.success(res, tree)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取当前用户菜单
export const getUserMenus = async (req, res) => {
  try {
    const user = req.user
    
    let menuIds = new Set()
    
    if (user.isAdmin) {
      // 超级管理员获取所有菜单
      const allMenus = await Menu.find({ status: 1, type: { $ne: 'button' } })
      menuIds = new Set(allMenus.map(m => m._id.toString()))
    } else {
      // 普通用户根据角色获取菜单
      user.roleIds.forEach(role => {
        role.menuIds.forEach(id => menuIds.add(id.toString()))
      })
    }
    
    const menus = await Menu.find({
      _id: { $in: Array.from(menuIds) },
      status: 1
    }).sort({ sort: 1 })
    
    // 构建树形结构
    const buildTree = (parentId = null) => {
      return menus
        .filter(menu => String(menu.parentId) === String(parentId))
        .map(menu => ({
          ...menu.toObject(),
          children: buildTree(menu._id)
        }))
    }
    
    const tree = buildTree()
    response.success(res, tree)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 创建菜单
export const createMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body)
    await menu.save()
    response.success(res, { id: menu._id }, '创建成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 更新菜单
export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!menu) {
      return response.error(res, '菜单不存在', 404)
    }
    response.success(res, menu, '更新成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 删除菜单
export const deleteMenu = async (req, res) => {
  try {
    // 检查是否有子菜单
    const children = await Menu.findOne({ parentId: req.params.id })
    if (children) {
      return response.error(res, '请先删除子菜单', 400)
    }
    
    const menu = await Menu.findByIdAndDelete(req.params.id)
    if (!menu) {
      return response.error(res, '菜单不存在', 404)
    }
    response.success(res, null, '删除成功')
  } catch (error) {
    response.error(res, error.message)
  }
}
