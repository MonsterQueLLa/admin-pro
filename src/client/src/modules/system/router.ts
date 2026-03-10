import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/system/users',
    name: 'UserManagement',
    component: () => import('./views/UserManager.vue'),
    meta: { title: '用户管理', icon: 'UserFilled', permission: 'system:user:view' }
  },
  {
    path: '/system/roles',
    name: 'RoleManagement',
    component: () => import('./views/RoleManager.vue'),
    meta: { title: '角色管理', icon: 'Avatar', permission: 'system:role:view' }
  },
  {
    path: '/system/menus',
    name: 'MenuManagement',
    component: () => import('./views/MenuManager.vue'),
    meta: { title: '菜单管理', icon: 'Menu', permission: 'system:menu:view' }
  },
  {
    path: '/system/settings',
    name: 'SystemSettings',
    component: () => import('./views/SystemSettings.vue'),
    meta: { title: '系统设置', icon: 'Setting' }
  },
  {
    path: '/system/logs',
    name: 'LogManagement',
    component: () => import('./views/LogManager.vue'),
    meta: { title: '操作日志', icon: 'Document', permission: 'system:log:view' }
  }
]

export default routes
