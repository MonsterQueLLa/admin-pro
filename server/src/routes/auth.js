import { Router } from 'express'
import { login, getUserInfo, logout } from '../controllers/auth.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 公开接口
router.post('/login', login)

// 需要认证的接口
router.use(authMiddleware)
router.get('/info', getUserInfo)
router.post('/logout', logout)

export default router
