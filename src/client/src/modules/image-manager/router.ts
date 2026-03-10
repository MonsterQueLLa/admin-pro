import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/images',
    name: 'ImageManager',
    component: () => import('./views/ImageManager.vue'),
    meta: { title: '图片管理', icon: 'PictureFilled', permission: 'image:view' }
  }
]

export default routes
