import { Router } from 'express'
import {
  getRoleList,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/role.js'
import { authMiddleware, permissionMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/', permissionMiddleware('system:role:view'), getRoleList)
router.get('/:id', permissionMiddleware('system:role:view'), getRoleById)
router.post('/', permissionMiddleware('system:role:create'), createRole)
router.put('/:id', permissionMiddleware('system:role:update'), updateRole)
router.delete('/:id', permissionMiddleware('system:role:delete'), deleteRole)

export default router
