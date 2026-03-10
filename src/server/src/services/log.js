import { Log } from '../models/log.js'

class LogService {
  // 创建日志
  async createLog(data) {
    return await Log.create(data)
  }

  // 获取日志列表
  async getLogList(params) {
    const { page = 1, pageSize = 20, userId, module, action, startTime, endTime } = params
    
    const query = {}
    if (userId) query.userId = userId
    if (module) query.module = module
    if (action) query.action = action
    if (startTime || endTime) {
      query.createdAt = {}
      if (startTime) query.createdAt.$gte = new Date(startTime)
      if (endTime) query.createdAt.$lte = new Date(endTime)
    }

    const total = await Log.countDocuments(query)
    const list = await Log.find(query)
      .populate('userId', 'username nickname')
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .sort({ createdAt: -1 })

    return { list, total }
  }

  // 获取日志详情
  async getLogById(id) {
    return await Log.findById(id).populate('userId', 'username nickname')
  }

  // 清理旧日志
  async clearOldLogs(days = 30) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return await Log.deleteMany({ createdAt: { $lt: date } })
  }
}

export const logService = new LogService()
