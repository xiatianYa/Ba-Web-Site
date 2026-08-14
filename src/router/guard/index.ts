import type { Router } from 'vue-router';

/** 创建路由守卫 */
export function createRouterGuard(router: Router) {
  // 每次路由切换后同步浏览器标题
  router.afterEach((to) => {
    const title = to.meta.title as string | undefined;
    document.title = title ? `${title} · Ba-Web-Site` : 'Ba-Web-Site';
  });
}
