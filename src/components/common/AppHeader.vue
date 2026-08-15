<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { i18n } from '@/locales';
import { NAV_MENUS, isMenuActive } from '@/constants/menu';
import { cn } from '@/utils/common';
import LangSwitch from '@/components/common/lang-switch.vue';
import ThemeSwitch from '@/components/common/theme-switch.vue';
import UserMenu from '@/components/common/user-menu.vue';

defineOptions({ name: 'AppHeader' });

const route = useRoute();

/** 当前页面标题（来自路由 meta.title 翻译键） */
const pageTitle = computed(() => {
  const title = route.meta?.title as string | undefined;
  return title ? i18n.global.t(title) : '';
});

/** 页面是否已滚动（用于顶栏阴影） */
const { y } = useWindowScroll();
const scrolled = computed(() => y.value > 8);

/** 菜单项激活态 */
const isActive = (path: string) => isMenuActive(path, route.path);

/** 顶部导航菜单项样式 */
const itemClass = (active: boolean) =>
  cn(
    'flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors duration-200',
    active
      ? 'bg-primary/10 text-primary'
      : 'text-base-content/60 hover:bg-base-200/70 hover:text-base-content'
  );
</script>

<template>
  <header class="sticky top-0 z-40">
    <!-- 顶部渐变点缀线 -->
    <div class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

    <div
      class="border-b border-base-300/60 bg-base-100/80 backdrop-blur-md transition-shadow duration-300"
      :class="scrolled ? 'shadow-[0_4px_16px_rgba(0,0,0,0.08)]' : 'shadow-none'"
    >
      <!-- 第一行：品牌 + 桌面端导航 + 右侧操作区（grid 三栏，导航严格居中） -->
      <div
        class="grid h-14 grid-cols-[1fr_auto] items-center gap-2 px-3 sm:px-4 lg:grid-cols-[auto_1fr_auto]"
      >
        <!-- 品牌 -->
        <router-link to="/" class="flex min-w-0 items-center gap-2.5">
          <img src="/logo.png" class="h-8 w-8 shrink-0 rounded-xl object-cover" alt="logo" />
          <span class="hidden truncate text-base font-extrabold tracking-tight sm:block">{{
            $t('system.title')
          }}</span>
        </router-link>

        <!-- 桌面端：水平导航菜单 -->
        <nav class="hidden items-center gap-1 justify-self-center lg:flex">
          <router-link
            v-for="item in NAV_MENUS"
            :key="item.name"
            :to="item.path"
            :class="itemClass(isActive(item.path))"
          >
            <Icon :icon="item.icon" class="h-4.5 w-4.5 shrink-0" />
            <span class="truncate">{{ $t(item.titleKey) }}</span>
          </router-link>
        </nav>

        <!-- 右侧操作区（语言 / 主题 / 用户菜单） -->
        <div class="flex items-center gap-1.5 justify-self-end">
          <LangSwitch />
          <ThemeSwitch />
          <UserMenu />
        </div>
      </div>

      <!-- 移动端：当前页标题 + 水平可滚动导航 -->
      <div class="flex items-center gap-2 border-t border-base-300/40 px-3 lg:hidden">
        <h1 class="shrink-0 text-xs font-semibold text-base-content/50">{{ pageTitle }}</h1>
        <nav class="nav-scroll flex flex-1 items-center gap-1 overflow-x-auto py-1.5">
          <router-link
            v-for="item in NAV_MENUS"
            :key="item.name"
            :to="item.path"
            :class="itemClass(isActive(item.path))"
          >
            <Icon :icon="item.icon" class="h-4 w-4 shrink-0" />
            <span class="whitespace-nowrap">{{ $t(item.titleKey) }}</span>
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 移动端导航横向滚动时隐藏滚动条 */
.nav-scroll {
  scrollbar-width: none;
}

.nav-scroll::-webkit-scrollbar {
  display: none;
}
</style>
