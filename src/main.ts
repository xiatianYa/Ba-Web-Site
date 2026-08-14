import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import './style.css';

async function setupApp() {
  const app = createApp(App);

  // 先挂载 Pinia，路由守卫等后续模块才能使用 store
  setupStore(app);
  await setupRouter(app);

  app.mount('#app');
}

setupApp();
