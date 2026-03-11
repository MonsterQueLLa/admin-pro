import type { App, DirectiveBinding } from 'vue'

// 加载图片时自动调用 getImageUrl
const getImageUrl = (path: string) => {
  if (!path) return ''
  // @ts-ignore
  const env: any = (import.meta as any).env || {}
  const base = env.VITE_API_BASE_URL || ''
  return base.replace(/\/$/, '') + path
}

export const setupImgDirective = (app: App) => {
  app.directive('img-fix', {
    mounted(el: HTMLImageElement, binding: DirectiveBinding) {
      const setSrc = (val: any) => {
        if (typeof val === 'string' && val.startsWith('/uploads')) {
          el.src = getImageUrl(val)
        } else {
          el.src = val
        }
      }

      setSrc(binding.value)
      el.addEventListener('error', () => {
        // 对于无效路径，显示占位文本
        el.alt = '图片无法显示'
      })
    },
    updated(el: HTMLImageElement, binding: DirectiveBinding) {
      if (binding.value !== binding.oldValue) {
        if (typeof binding.value === 'string' && binding.value.startsWith('/uploads')) {
          el.src = getImageUrl(binding.value)
        } else {
          el.src = binding.value
        }
      }
    }
  })
}
