import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  getImageList,
  uploadImage,
  getImageById,
  updateImage,
  deleteImage,
  batchDeleteImages
} from '../controllers/image.js'
import { authMiddleware, permissionMiddleware } from '../middleware/auth.js'
import { config } from '../config/index.js'

const router = Router()

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads', 'temp'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  }
})

router.use(authMiddleware)

router.get('/', permissionMiddleware('image:view'), getImageList)
router.post('/upload', permissionMiddleware('image:upload'), upload.single('file'), uploadImage)
router.get('/:id', permissionMiddleware('image:view'), getImageById)
router.put('/:id', permissionMiddleware('image:update'), upload.single('file'), updateImage)
router.delete('/:id', permissionMiddleware('image:delete'), deleteImage)
router.post('/batch-delete', permissionMiddleware('image:delete'), batchDeleteImages)

export default router
