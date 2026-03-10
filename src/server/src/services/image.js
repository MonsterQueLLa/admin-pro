import { Image } from '../models/image.js'
import fs from 'fs'
import path from 'path'

class ImageService {
  // 获取图片列表
  async getImageList(params, user) {
    const { page = 1, pageSize = 20, subjects, type, keyword } = params
    
    const query = {}
    
    // 数据权限过滤
    if (!user.isAdmin) {
      query.creatorId = user._id
    }
    
    if (subjects) {
      query.subjects = { $in: subjects.split(',') }
    }
    if (type) {
      query.type = type
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    }

    const total = await Image.countDocuments(query)
    const list = await Image.find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .sort({ createdAt: -1 })

    return { list, total }
  }

  // 创建图片记录
  async createImage(data) {
    const image = new Image(data)
    await image.save()
    return image
  }

  // 更新图片
  async updateImage(id, data) {
    return await Image.findByIdAndUpdate(id, data, { new: true })
  }

  // 删除图片
  async deleteImage(id) {
    const image = await Image.findById(id)
    if (!image) {
      throw new Error('图片不存在')
    }
    
    // 删除文件
    const originalFullPath = path.join(process.cwd(), image.originalPath)
    const thumbnailFullPath = path.join(process.cwd(), image.thumbnailPath)
    
    if (fs.existsSync(originalFullPath)) {
      fs.unlinkSync(originalFullPath)
    }
    if (fs.existsSync(thumbnailFullPath)) {
      fs.unlinkSync(thumbnailFullPath)
    }
    
    await Image.findByIdAndDelete(id)
    return image
  }

  // 批量删除
  async batchDelete(ids) {
    const images = await Image.find({ _id: { $in: ids } })
    
    for (const image of images) {
      const originalFullPath = path.join(process.cwd(), image.originalPath)
      const thumbnailFullPath = path.join(process.cwd(), image.thumbnailPath)
      
      if (fs.existsSync(originalFullPath)) {
        fs.unlinkSync(originalFullPath)
      }
      if (fs.existsSync(thumbnailFullPath)) {
        fs.unlinkSync(thumbnailFullPath)
      }
    }
    
    return await Image.deleteMany({ _id: { $in: ids } })
  }

  // 获取统计信息
  async getStats() {
    const total = await Image.countDocuments()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = await Image.countDocuments({ createdAt: { $gte: today } })
    
    return { total, todayCount }
  }
}

export const imageService = new ImageService()
