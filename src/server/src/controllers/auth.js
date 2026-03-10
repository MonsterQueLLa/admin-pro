import { User } from '../models/user.js'
import { Role } from '../models/role.js'
import { generateToken } from '../middleware/auth.js'
import { response } from '../utils/response.js'

// 登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    
    const user = await User.findOne({ username }).populate('roleIds')
    if (!user) {
      return response.error(res, '用户名或密码错误', 400)
    }
    
    if (user.status === 0) {
      return response.error(res, '账号已被禁用', 403)
    }
    
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return response.error(res, '用户名或密码错误', 400)
    }
    
    // 更新登录信息
    user.lastLoginAt = new Date()
    user.lastLoginIp = req.ip
    await user.save()
    
    // 生成 Token
    const token = generateToken({ userId: user._id })
    
    // 获取权限列表
    const permissions = new Set()
    user.roleIds.forEach(role => {
      role.permissions.forEach(p => permissions.add(p))
    })
    
    response.success(res, {
      token,
      expiresIn: 7 * 24 * 60 * 60,
      user: {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        roles: user.roleIds.map(r => r.code),
        permissions: Array.from(permissions),
        isAdmin: user.isAdmin
      }
    }, '登录成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取当前用户信息
export const getUserInfo = async (req, res) => {
  try {
    const user = req.user
    
    const permissions = new Set()
    user.roleIds.forEach(role => {
      role.permissions.forEach(p => permissions.add(p))
    })
    
    response.success(res, {
      id: user._id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone,
      roles: user.roleIds.map(r => ({ id: r._id, name: r.name, code: r.code })),
      permissions: Array.from(permissions),
      isAdmin: user.isAdmin
    })
  } catch (error) {
    response.error(res, error.message)
  }
}

// 登出
export const logout = async (req, res) => {
  response.success(res, null, '登出成功')
}
