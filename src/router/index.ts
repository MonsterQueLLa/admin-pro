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
        path: 'images',
        name: 'ImageManager',
        component: () => import('@/views/images/index.vue'),
        meta: { title: '图片管理', icon: 'PictureFilled', permission: 'image:view' }
      },
      {
        path: 'system/users',
        name: 'UserManagement',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理', icon: 'UserFilled', permission: 'system:user:view' }
      },
      {
        path: 'system/roles',
        name: 'RoleManagement',
        component: () => import('@/views/roles/index.vue'),
        meta: { title: '角色管理', icon: 'Avatar', permission: 'system:role:view' }
      },
      {
        path: 'system/menus',
        name: 'MenuManagement',
        component: () => import('@/views/menus/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu', permission: 'system:menu:view' }
      },
      {
        path: 'system/settings',
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
  document.title = to.meta.title ? `${to.meta.title} - Admin Pro` : 'Admin Pro'
  
  if (to.meta.public) {
    next()
    return
  }
  
  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }
  
  next()
})

export default router
