import type { Directive, App } from 'vue'
import { useUserStore } from '@/core/store/user'

// 权限指令 v-permission
export const permissionDirective: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value && !userStore.hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// 注册所有指令
export const setupDirectives = (app: App) => {
  app.directive('permission', permissionDirective)
}
