import request from '@/core/utils/request'

export interface LogItem {
  _id: string
  userId: string
  username: string
  module: string
  action: string
  description: string
  method: string
  url: string
  status: number
  ip: string
  duration: number
  createdAt: string
}

export interface LogParams {
  page?: number
  pageSize?: number
  userId?: string
  module?: string
  action?: string
  startTime?: string
  endTime?: string
}

// 获取日志列表
export const getLogListApi = (params: LogParams) => {
  return request.get<{ list: LogItem[]; pagination: any }>('/logs', { params })
}

// 获取日志详情
export const getLogDetailApi = (id: string) => {
  return request.get<LogItem>(`/logs/${id}`)
}

// 清理旧日志
export const clearOldLogsApi = (days: number) => {
  return request.post('/logs/clear', { days })
}
