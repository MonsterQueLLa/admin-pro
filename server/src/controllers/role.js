import { Role } from '../models/role.js'
import { response } from '../utils/response.js'

// 获取角色列表
export const getRoleList = async (req, res) => {
  try {
    const list = await Role.find().sort({ sort: 1, createdAt: -1 })
    response.success(res, list)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取角色详情
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) {
      return response.error(res, '角色不存在', 404)
    }
    response.success(res, role)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 创建角色
export const createRole = async (req, res) => {
  try {
    const { name, code, description, permissions, menuIds, dataScope } = req.body
    
    const existingRole = await Role.findOne({ code })
    if (existingRole) {
      return response.error(res, '角色编码已存在', 400)
    }
    
    const role = new Role({
      name,
      code,
      description,
      permissions,
      menuIds,
      dataScope
    })
    
    await role.save()
    response.success(res, { id: role._id }, '创建成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 更新角色
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    if (!role) {
      return response.error(res, '角色不存在', 404)
    }
    
    response.success(res, role, '更新成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 删除角色
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id)
    if (!role) {
      return response.error(res, '角色不存在', 404)
    }
    response.success(res, null, '删除成功')
  } catch (error) {
    response.error(res, error.message)
  }
}
