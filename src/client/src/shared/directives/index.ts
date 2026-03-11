import type { App } from 'vue'
import { setupDirectives } from './permission'
import { setupImgDirective } from './imgfix'

export const setupAllDirectives = (app: App) => {
  setupDirectives(app)
  setupImgDirective(app)
}
