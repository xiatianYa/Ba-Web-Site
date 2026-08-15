import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupI18n } from './locales';
import { setupAssets } from '@/plugins/assets';
import { setupClickFx } from '@/plugins/click-fx';
import vReveal from '@/directives/reveal';
import '@/style/index.css';
import '@/style/nprogress.css';

async function setupApp() {
  const app = createApp(App);

  // 注册图标等全局资源
  setupAssets();

  // 全局注册视口入场动画指令
  app.directive('reveal', vReveal);

  // 先挂载 Pinia 与 i18n，路由守卫等后续模块才能使用
  setupStore(app);
  setupI18n(app);
  await setupRouter(app);

  app.mount('#app');

  // 全局蔚蓝档案风格鼠标点击特效（DOM 就绪后初始化）
  setupClickFx();
}

setupApp();
