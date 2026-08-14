import { watch } from 'vue';
import type { Router } from 'vue-router';
import { i18n } from '@/locales';
import { APP_NAME } from '@/constants/app';
import { createProgressGuard } from './progress';

/** 根据当前路由 meta.title（i18n 键）同步浏览器标题 */
function syncDocumentTitle(router: Router) {
  const metaTitle = router.currentRoute.value.meta.title as string | undefined;
  const title = metaTitle ? i18n.global.t(metaTitle) : '';
  document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
}

/** 创建路由守卫 */
export function createRouterGuard(router: Router) {
  // 路由加载进度条
  createProgressGuard(router);

  // 每次路由切换后同步浏览器标题
  router.afterEach(() => {
    syncDocumentTitle(router);
  });

  // 语言切换时同步更新标题
  watch(
    () => i18n.global.locale.value,
    () => {
      syncDocumentTitle(router);
    }
  );
}
