import { logService } from '../services/log.js'

// 操作日志中间件
export const logMiddleware = async (req, res, next) => {
  // 跳过健康检查和静态资源
  if (req.path === '/health' || req.path.startsWith('/uploads')) {
    return next()
  }

  const startTime = Date.now()
  
  // 保存原始 json 方法
  const originalJson = res.json.bind(res)
  
  // 重写 json 方法以捕获响应
  res.json = (body) => {
    // 恢复原始方法
    res.json = originalJson
    
    // 计算请求耗时
    const duration = Date.now() - startTime
    
    // 如果有用户信息，记录日志
    if (req.user) {
      const logData = {
        userId: req.user._id,
        username: req.user.username,
        module: getModuleName(req.path),
        action: getActionName(req.method, req.path),
        description: getActionDescription(req.method, req.path),
        method: req.method,
        url: req.originalUrl,
        params: { ...req.body, ...req.query },
        status: res.statusCode,
        result: JSON.stringify(body).substring(0, 500),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        duration
      }
      
      // 异步记录日志，不阻塞响应
      logService.createLog(logData).catch(console.error)
    }
    
    return originalJson(body)
  }
  
  next()
}

// 获取模块名称
function getModuleName(path) {
  if (path.includes('/users')) return '用户管理'
  if (path.includes('/roles')) return '角色管理'
  if (path.includes('/menus')) return '菜单管理'
  if (path.includes('/images')) return '图片管理'
  if (path.includes('/logs')) return '日志管理'
  if (path.includes('/auth')) return '认证'
  return '其他'
}

// 获取操作名称
function getActionName(method, path) {
  if (path.includes('/login')) return '登录'
  if (path.includes('/logout')) return '登出'
  if (method === 'GET') return '查询'
  if (method === 'POST') return '新增'
  if (method === 'PUT') return '更新'
  if (method === 'DELETE') return '删除'
  return '操作'
}

// 获取操作描述
function getActionDescription(method, path) {
  if (path.includes('/login')) return '用户登录系统'
  if (path.includes('/logout')) return '用户退出登录'
  if (path.includes('/reset-password')) return '重置用户密码'
  if (method === 'GET') return '查询数据'
  if (method === 'POST') return '创建新数据'
  if (method === 'PUT') return '更新数据'
  if (method === 'DELETE') return '删除数据'
  return '执行操作'
}
