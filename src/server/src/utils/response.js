export const response = {
  success: (res, data = null, message = '操作成功') => {
    res.json({
      code: 0,
      message,
      data,
      timestamp: Date.now()
    })
  },
  
  error: (res, message = '操作失败', code = 500, statusCode = 200) => {
    res.status(statusCode).json({
      code,
      message,
      data: null,
      timestamp: Date.now()
    })
  },
  
  paginate: (res, list, pagination) => {
    res.json({
      code: 0,
      message: '查询成功',
      data: {
        list,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          totalPages: Math.ceil(pagination.total / pagination.pageSize)
        }
      },
      timestamp: Date.now()
    })
  }
}
