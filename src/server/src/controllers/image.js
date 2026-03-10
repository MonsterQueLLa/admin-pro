import { Image } from '../models/image.js'
import { response } from '../utils/response.js'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { config } from '../config/index.js'

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), config.upload.uploadDir)
const thumbnailDir = path.join(uploadDir, 'thumbnails')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true })
}

// 获取图片列表
export const getImageList = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, subjects, type, keyword } = req.query
    
    const query = {}
    
    // 数据权限过滤
    if (!req.user.isAdmin) {
      query.creatorId = req.user._id
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
    
    response.paginate(res, list, { page: parseInt(page), pageSize: parseInt(pageSize), total })
  } catch (error) {
    response.error(res, error.message)
  }
}

// 上传图片
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return response.error(res, '请选择要上传的图片', 400)
    }
    
    const file = req.file
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
    const originalPath = path.join(uploadDir, filename)
    const thumbnailPath = path.join(thumbnailDir, filename)
    
    // 保存原图（使用 copy + unlink 替代 rename，支持跨文件系统）
    fs.copyFileSync(file.path, originalPath)
    fs.unlinkSync(file.path)
    
    // 生成缩略图
    const metadata = await sharp(originalPath).metadata()
    await sharp(originalPath)
      .resize(300, 300, { fit: 'inside' })
      .toFile(thumbnailPath)
    
    // 保存到数据库
    const image = new Image({
      title: file.originalname.replace(path.extname(file.originalname), ''),
      originalPath: `/uploads/${filename}`,
      thumbnailPath: `/uploads/thumbnails/${filename}`,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      creatorId: req.user._id,
      creatorName: req.user.nickname || req.user.username
    })
    
    await image.save()
    response.success(res, image, '上传成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 获取图片详情
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
    if (!image) {
      return response.error(res, '图片不存在', 404)
    }
    response.success(res, image)
  } catch (error) {
    response.error(res, error.message)
  }
}

// 更新图片信息
export const updateImage = async (req, res) => {
  try {
    const { title, description, subjects, type, date, device, location } = req.body
    
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { title, description, subjects, type, date, device, location },
      { new: true }
    )
    
    if (!image) {
      return response.error(res, '图片不存在', 404)
    }
    
    response.success(res, image, '更新成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 删除图片
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
    if (!image) {
      return response.error(res, '图片不存在', 404)
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
    
    await Image.findByIdAndDelete(req.params.id)
    response.success(res, null, '删除成功')
  } catch (error) {
    response.error(res, error.message)
  }
}

// 批量删除
export const batchDeleteImages = async (req, res) => {
  try {
    const { ids } = req.body
    
    const images = await Image.find({ _id: { $in: ids } })
    
    // 删除文件
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
    
    await Image.deleteMany({ _id: { $in: ids } })
    response.success(res, null, `成功删除 ${ids.length} 张图片`)
  } catch (error) {
    response.error(res, error.message)
  }
}
