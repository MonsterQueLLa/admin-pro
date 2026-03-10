import request from '@/core/utils/request'

export interface ImageItem {
  _id: string
  title: string
  description: string
  originalPath: string
  thumbnailPath: string
  subjects: string[]
  type: string
  date: string
  device: string
  location: string
  width: number
  height: number
  size: number
  format: string
  creatorName: string
  createdAt: string
}

export interface ImageParams {
  page?: number
  pageSize?: number
  keyword?: string
  subjects?: string
  type?: string
}

// 获取图片列表
export const getImageListApi = (params: ImageParams) => {
  return request.get<{ list: ImageItem[]; pagination: any }>('/images', { params })
}

// 上传图片
export const uploadImageApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<ImageItem>('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 更新图片信息
export const updateImageApi = (id: string, data: Partial<ImageItem>) => {
  return request.put(`/images/${id}`, data)
}

// 删除图片
export const deleteImageApi = (id: string) => {
  return request.delete(`/images/${id}`)
}

// 批量删除
export const batchDeleteImagesApi = (ids: string[]) => {
  return request.post('/images/batch-delete', { ids })
}
