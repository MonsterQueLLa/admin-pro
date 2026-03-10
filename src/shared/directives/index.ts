import type { App } from 'vue'
import { setupDirectives } from './permission'

export const setupAllDirectives = (app: App) => {
  setupDirectives(app)
}
