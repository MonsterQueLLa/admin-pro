import jwt from 'jsonwebtoken'
import { config } from '../../config/index.js'
import { response } from '../utils/response.js'
import { User } from '../models/user.js'

// 生成 Token
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

// 验证 Token
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return response.error(res, '请先登录', 401, 401)
    }
    
    const decoded = jwt.verify(token, config.jwtSecret)
    const user = await User.findById(decoded.userId).populate('roleIds')
    
    if (!user || user.status === 0) {
      return response.error(res, '用户不存在或已被禁用', 401, 401)
    }
    
    req.user = user
    next()
  } catch (error) {
    return response.error(res, 'Token 无效或已过期', 401, 401)
  }
}

// 权限检查
export const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = req.user
      
      // 超级管理员拥有所有权限
      if (user.isAdmin) {
        return next()
      }
      
      // 获取用户所有权限
      const permissions = new Set()
      for (const role of user.roleIds) {
        role.permissions.forEach(p => permissions.add(p))
      }
      
      // 检查是否有所需权限
      if (requiredPermission && !permissions.has(requiredPermission)) {
        return response.error(res, '没有操作权限', 403, 403)
      }
      
      next()
    } catch (error) {
      return response.error(res, '权限检查失败', 500)
    }
  }
}
