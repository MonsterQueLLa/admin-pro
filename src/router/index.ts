import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理', icon: 'UserFilled' }
      },
      {
        path: 'roles',
        name: 'RoleManagement',
        component: () => import('@/views/roles/index.vue'),
        meta: { title: '角色管理', icon: 'Avatar' }
      },
      {
        path: 'permissions',
        name: 'PermissionManagement',
        component: () => import('@/views/permissions/index.vue'),
        meta: { title: '权限管理', icon: 'Lock' }
      },
      {
        path: 'system',
        name: 'SystemSettings',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - Admin Pro` : 'Admin Pro'
  
  // 公开页面直接放行
  if (to.meta.public) {
    next()
    return
  }
  
  // TODO: 添加登录验证逻辑
  // const token = localStorage.getItem('token')
  // if (!token) {
  //   next('/login')
  //   return
  // }
  
  next()
})

export default router
