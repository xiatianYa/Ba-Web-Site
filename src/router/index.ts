import type { App } from 'vue';
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { createRouterGuard } from './guard';

/** 应用路由表（新增页面在此追加） */
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
          meta: { title: '首页' }
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/views/setting/index.vue'),
          meta: { title: '设置' }
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/about/index.vue'),
          meta: { title: '关于' }
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
  history: createWebHashHistory(),
  routes: createVueRoutes()
});

/** 挂载 Vue Router */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
