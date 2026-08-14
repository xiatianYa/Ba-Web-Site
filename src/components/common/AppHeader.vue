<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { i18n } from '@/locales';
import IconButton from '@/components/common/icon-button.vue';
import LangSwitch from '@/components/common/lang-switch.vue';
import ThemeSwitch from '@/components/common/theme-switch.vue';
import UserMenu from '@/components/common/user-menu.vue';

defineOptions({ name: 'AppHeader' });

const props = defineProps<{
  /** 侧边栏是否已折叠 */
  collapsed: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleSider'): void;
  (e: 'openMobile'): void;
}>();

const route = useRoute();

/** 当前页面标题（来自路由 meta.title 翻译键） */
const pageTitle = computed(() => {
  const title = route.meta?.title as string | undefined;
  return title ? i18n.global.t(title) : '';
});
</script>

<template>
  <header class="sticky top-0 z-40">
    <!-- 顶部渐变点缀线 -->
    <div class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

    <div class="flex h-14 items-center gap-2 border-b border-base-300/60 bg-base-100/80 px-3 backdrop-blur-md sm:px-4">
      <!-- 移动端：汉堡按钮 -->
      <IconButton
        class="lg:hidden"
        icon="heroicons:bars-3"
        :label="$t('nav.toggleMenu')"
        @click="emit('openMobile')"
      />

      <!-- PC 端：侧边栏折叠按钮 -->
      <IconButton
        class="hidden lg:inline-grid"
        :icon="collapsed ? 'heroicons:chevron-double-right' : 'heroicons:chevron-double-left'"
        :label="$t(collapsed ? 'nav.expand' : 'nav.collapse')"
        :title="$t(collapsed ? 'nav.expand' : 'nav.collapse')"
        @click="emit('toggleSider')"
      />

      <!-- 当前页面标题 -->
      <h1 class="ml-1 truncate text-sm font-semibold text-base-content/80">{{ pageTitle }}</h1>

      <!-- 右侧操作区（语言 / 主题 / 用户菜单各自独立，不分组） -->
      <div class="ml-auto flex items-center gap-1.5">
        <LangSwitch />
        <ThemeSwitch />
        <UserMenu />
      </div>
    </div>
  </header>
</template>
