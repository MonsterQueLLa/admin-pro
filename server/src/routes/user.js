import { Router } from 'express'
import {
  getUserList,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} from '../controllers/user.js'
import { authMiddleware, permissionMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/', permissionMiddleware('system:user:view'), getUserList)
router.get('/:id', permissionMiddleware('system:user:view'), getUserById)
router.post('/', permissionMiddleware('system:user:create'), createUser)
router.put('/:id', permissionMiddleware('system:user:update'), updateUser)
router.delete('/:id', permissionMiddleware('system:user:delete'), deleteUser)
router.put('/:id/reset-password', permissionMiddleware('system:user:update'), resetPassword)

export default router
