import { Router } from 'express'
import { getLogList, getLogById, clearOldLogs } from '../controllers/log.js'
import { authMiddleware, permissionMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/', permissionMiddleware('system:log:view'), getLogList)
router.get('/:id', permissionMiddleware('system:log:view'), getLogById)
router.post('/clear', permissionMiddleware('system:log:delete'), clearOldLogs)

export default router
