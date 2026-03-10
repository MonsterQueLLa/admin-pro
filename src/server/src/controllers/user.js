import { User } from '../models/user.js'
import { response } from '../utils/response.js'

// 获取用户列表
export const getUserList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = req.query
    
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
    
    response.paginate(res, list, { page: parseInt(page), pageSize: parseInt(pageSize), total })
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取用户详情
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('roleIds', 'name code')
      .select('-password')
    
    if (!user) {
      return response.error(res, '用户不存在', 404)
    }
    
    response.success(res, user)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 创建用户
export const createUser = async (req, res) => {
  try {
    const { username, password, nickname, email, phone, roleIds, status } = req.body
    
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.error(res, '用户名已存在', 400)
    }
    
    const user = new User({
      username,
      password,
      nickname,
      email,
      phone,
      roleIds,
      status
    })
    
    await user.save()
    response.success(res, { id: user._id }, '创建成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 更新用户
export const updateUser = async (req, res) => {
  try {
    const { nickname, email, phone, roleIds, status } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nickname, email, phone, roleIds, status },
      { new: true }
    ).select('-password')
    
    if (!user) {
      return response.error(res, '用户不存在', 404)
    }
    
    response.success(res, user, '更新成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 删除用户
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return response.error(res, '用户不存在', 404)
    }
    response.success(res, null, '删除成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 重置密码
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return response.error(res, '用户不存在', 404)
    }
    
    user.password = password
    await user.save()
    
    response.success(res, null, '密码重置成功')
  } catch (error) {
    response.error(res, error.message)
  }
}
