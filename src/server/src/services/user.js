import { User } from '../models/user.js'
import bcrypt from 'bcryptjs'

class UserService {
  // 创建用户
  async createUser(data) {
    const existingUser = await User.findOne({ username: data.username })
    if (existingUser) {
      throw new Error('用户名已存在')
    }
    
    const user = new User(data)
    await user.save()
    return user
  }

  // 验证用户
  async validateUser(username, password) {
    const user = await User.findOne({ username }).populate('roleIds')
    if (!user) {
      throw new Error('用户名或密码错误')
    }
    
    if (user.status === 0) {
      throw new Error('账号已被禁用')
    }
    
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      throw new Error('用户名或密码错误')
    }
    
    return user
  }

  // 更新登录信息
  async updateLoginInfo(userId, ip) {
    return await User.findByIdAndUpdate(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ip
    })
  }

  // 获取用户列表
  async getUserList(params) {
    const { page = 1, pageSize = 10, keyword = '' } = params
    
    const query = {}
    if (keyword) {
      query.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { nickname: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ]
    }

    const total = await User.countDocuments(query)
    const list = await User.find(query)
      .populate('roleIds', 'name code')
      .select('-password')
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .sort({ createdAt: -1 })

    return { list, total }
  }

  // 重置密码
  async resetPassword(userId, newPassword) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('用户不存在')
    }
    
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    return user
  }
}

export const userService = new UserService()
