import { logService } from '../services/log.js'
import { response } from '../utils/response.js'

// 获取日志列表
export const getLogList = async (req, res) => {
  try {
    const result = await logService.getLogList(req.query)
    response.paginate(res, result.list, {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20,
      total: result.total
    })
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取日志详情
export const getLogById = async (req, res) => {
  try {
    const log = await logService.getLogById(req.params.id)
    if (!log) {
      return response.error(res, '日志不存在', 404)
    }
    response.success(res, log)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 清理旧日志
export const clearOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.body
    const result = await logService.clearOldLogs(days)
    response.success(res, { deletedCount: result.deletedCount }, `已清理 ${result.deletedCount} 条旧日志`)
  } catch (error) {
    response.error(res, error.message)
  }
}
