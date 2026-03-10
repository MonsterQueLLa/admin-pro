import { Router } from 'express'
import {
  getMenuTree,
  getUserMenus,
  createMenu,
  updateMenu,
  deleteMenu
} from '../controllers/menu.js'
import { authMiddleware, permissionMiddleware } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/tree', getMenuTree)
router.get('/user', getUserMenus)
router.post('/', permissionMiddleware('system:menu:create'), createMenu)
router.put('/:id', permissionMiddleware('system:menu:update'), updateMenu)
router.delete('/:id', permissionMiddleware('system:menu:delete'), deleteMenu)

export default router
