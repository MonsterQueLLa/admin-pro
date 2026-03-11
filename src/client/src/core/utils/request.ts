import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 0) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    // 自动为图片路径添加基础 URL——遍历响应对象
    const fixImageUrl = (obj: any) => {
      if (!obj || typeof obj !== 'object') return
      if (obj.originalPath) {
        obj.originalPath = getImageUrl(obj.originalPath)
      }
      if (obj.thumbnailPath) {
        obj.thumbnailPath = getImageUrl(obj.thumbnailPath)
      }
      for (const key in obj) {
        fixImageUrl(obj[key])
      }
    }
    const getImageUrl = (path: string) => {
      if (!path) return ''
      // @ts-ignore
      const env: any = (import.meta as any).env || {}
      const base = env.VITE_API_BASE_URL || ''
      return base.replace(/\/$/, '') + path
    }
    const result = data.data
    fixImageUrl(result)
    return result
  },
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else {
      ElMessage.error(response?.data?.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
