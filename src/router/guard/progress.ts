import NProgress from 'nprogress';
import type { Router } from 'vue-router';

NProgress.configure({ showSpinner: false });

/** 路由加载进度条 */
export function createProgressGuard(router: Router) {
  router.beforeEach(() => {
    NProgress.start();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
