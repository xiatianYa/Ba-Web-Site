import type { App } from 'vue';
import { createPinia } from 'pinia';

/** 挂载 Pinia */
export function setupStore(app: App) {
  const store = createPinia();
  app.use(store);
}
