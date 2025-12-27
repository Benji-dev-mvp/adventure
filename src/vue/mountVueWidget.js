import { createApp } from 'vue'
import Widget from './Widget.vue'

/**
 * Mounts the Vue Widget into a provided DOM node.
 * Returns a controller with an unmount() method.
 */
export function mount(container, props = {}) {
  if (!container) throw new Error('Vue mount container is required')
  const app = createApp(Widget, props)
  app.config.errorHandler = (err) => {
    // Keep errors contained so React app remains stable
    console.error('[VueWidget] Error:', err)
  }
  app.mount(container)
  return {
    unmount() {
      try { app.unmount() } catch (e) { /* noop */ }
    }
  }
}
