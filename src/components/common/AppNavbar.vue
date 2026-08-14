<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store/modules/app';

defineOptions({ name: 'AppNavbar' });

/** 导航菜单（新增页面时在此追加，需与 router 中路由对应） */
const menus = [
  {
    name: 'home',
    path: '/',
    title: '首页',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75'
  },
  {
    name: 'setting',
    path: '/setting',
    title: '设置',
    icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    name: 'about',
    path: '/about',
    title: '关于',
    icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
  }
];

const appStore = useAppStore();
const route = useRoute();

/** 移动端菜单展开状态 */
const mobileOpen = ref(false);

/** 路由切换后自动收起移动端菜单 */
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  }
);

/** 判断菜单是否处于激活态 */
function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path);
}
</script>

<template>
  <header class="sticky top-0 z-40 shadow-sm">
    <!-- 顶部渐变点缀线 -->
    <div class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"></div>

    <nav class="navbar mx-auto max-w-6xl px-4 backdrop-blur-md">
      <!-- 左侧：移动端汉堡按钮 + 品牌 -->
      <div class="navbar-start">
        <button
          class="btn btn-ghost btn-circle lg:hidden"
          aria-label="切换菜单"
          @click="mobileOpen = !mobileOpen"
        >
          <!-- 汉堡 / 关闭 图标 -->
          <svg
            v-if="!mobileOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 品牌：渐变 Logo + 名称 -->
        <router-link to="/" class="flex items-center gap-2 px-2">
          <span
            class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </span>
          <span class="text-lg font-extrabold tracking-tight">Ba-Web-Site</span>
        </router-link>
      </div>

      <!-- 中间：PC 端分段式菜单（lg 及以上显示） -->
      <div class="navbar-center hidden lg:flex">
        <div class="flex items-center gap-1 rounded-full bg-base-200/70 p-1">
          <router-link
            v-for="item in menus"
            :key="item.name"
            :to="item.path"
            class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'bg-base-100 text-primary shadow-sm'
                : 'text-base-content/60 hover:bg-base-100/60 hover:text-base-content'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="item.icon" />
            </svg>
            {{ item.title }}
          </router-link>
        </div>
      </div>

      <!-- 右侧：主题切换 -->
      <div class="navbar-end">
        <button
          class="btn btn-ghost btn-circle"
          aria-label="切换主题"
          @click="appStore.toggleDarkMode()"
        >
          <!-- 月亮（深色模式下显示，点击切回浅色） -->
          <svg
            v-if="appStore.darkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m13.364-6.364l-1.414 1.414m0 12.728l1.414 1.414M6.636 6.636l1.414 1.414m0 12.728l-1.414 1.414M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <!-- 太阳（浅色模式下显示，点击切到深色） -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- 移动端：下拉菜单（lg 以下显示） -->
    <Transition name="dropdown">
      <div v-if="mobileOpen" class="border-t border-base-300 bg-base-100 lg:hidden">
        <nav class="mx-auto max-w-6xl px-4 py-3">
          <ul class="flex flex-col gap-1">
            <li v-for="item in menus" :key="item.name">
              <router-link
                :to="item.path"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                :class="
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/70 hover:bg-base-200'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path :d="item.icon" />
                </svg>
                {{ item.title }}
                <!-- 激活指示点 -->
                <span
                  v-if="isActive(item.path)"
                  class="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                ></span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </header>
</template>
