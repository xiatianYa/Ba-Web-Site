import type { App } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createRouterGuard } from './guard';

/** 应用路由表（新增页面在此追加，meta.title 为 locales 中的翻译键） */
function createVueRoutes(): RouteRecordRaw[] {
  return [
    {
      path: '/',
      name: 'root',
      // 通用布局：顶部导航栏 + 内容区
      component: () => import('@/layout/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: 'routes.home' }
        },
        {
          path: 'server',
          name: 'server',
          component: () => import('@/views/server/index.vue'),
          meta: { title: 'routes.server' }
        },
        {
          path: 'tools',
          name: 'tools',
          component: () => import('@/views/tools/index.vue'),
          meta: { title: 'routes.tools' }
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/views/setting/index.vue'),
          meta: { title: 'routes.setting' }
        }
      ]
    },
    // 未匹配路由重定向回首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ];
}

export const router = createRouter({
  history: createWebHistory(),
  routes: createVueRoutes()
});

/** 挂载 Vue Router */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
