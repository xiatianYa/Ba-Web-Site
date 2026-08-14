<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { i18n, setLocale } from '@/locales';
import { LANG_OPTIONS } from '@/constants/app';
import { useTheme } from '@/hooks/common/use-theme';
import { cn } from '@/utils/common';

defineOptions({ name: 'AppHeader' });

const props = defineProps<{
  /** 侧边栏是否已折叠 */
  collapsed: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleSider'): void;
  (e: 'openMobile'): void;
}>();

const { darkMode, toggleDarkMode } = useTheme();
const route = useRoute();

/** 当前页面标题（来自路由 meta.title 翻译键） */
const pageTitle = computed(() => {
  const title = route.meta?.title as string | undefined;
  return title ? i18n.global.t(title) : '';
});

/** 当前语言 */
const currentLocale = computed(() => i18n.global.locale.value);

/** 切换语言 */
function handleSwitchLang(value: App.I18n.LangType) {
  setLocale(value);
}
</script>

<template>
  <header class="sticky top-0 z-40">
    <!-- 顶部渐变点缀线 -->
    <div class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

    <div class="flex h-14 items-center gap-2 border-b border-base-300/60 bg-base-100/80 px-3 backdrop-blur-md sm:px-4">
      <!-- 移动端：汉堡按钮 -->
      <button
        class="header-icon-btn lg:hidden"
        :aria-label="$t('nav.toggleMenu')"
        @click="emit('openMobile')"
      >
        <Icon icon="heroicons:bars-3" class="h-5 w-5" />
      </button>

      <!-- PC 端：侧边栏折叠按钮 -->
      <button
        class="header-icon-btn hidden lg:inline-grid"
        :aria-label="$t(collapsed ? 'nav.expand' : 'nav.collapse')"
        :title="$t(collapsed ? 'nav.expand' : 'nav.collapse')"
        @click="emit('toggleSider')"
      >
        <Icon
          :icon="collapsed ? 'heroicons:chevron-double-right' : 'heroicons:chevron-double-left'"
          class="h-5 w-5"
        />
      </button>

      <!-- 当前页面标题 -->
      <h1 class="ml-1 truncate text-sm font-semibold text-base-content/80">{{ pageTitle }}</h1>

      <!-- 右侧操作按钮组（分组圆角容器，视觉更精致） -->
      <div class="ml-auto flex items-center gap-0.5 rounded-full border border-base-300/70 bg-base-100/70 p-0.5 shadow-sm backdrop-blur">
        <!-- 语言切换 -->
        <div class="dropdown dropdown-end">
          <button
            tabindex="0"
            class="header-icon-btn"
            :aria-label="$t('nav.switchLanguage')"
            :title="$t('nav.switchLanguage')"
          >
            <Icon icon="heroicons:language" class="h-5 w-5" />
          </button>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 mt-2 w-44 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
          >
            <li v-for="opt in LANG_OPTIONS" :key="opt.value">
              <a
                :class="cn('justify-between gap-2', currentLocale === opt.value && 'menu-active')"
                @click="handleSwitchLang(opt.value)"
              >
                {{ $t(opt.labelKey) }}
                <Icon v-if="currentLocale === opt.value" icon="heroicons:check" class="h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>

        <!-- 主题切换 -->
        <button
          class="header-icon-btn"
          :aria-label="$t('nav.toggleTheme')"
          :title="$t('nav.toggleTheme')"
          @click="toggleDarkMode"
        >
          <Icon :icon="darkMode ? 'heroicons:sun' : 'heroicons:moon'" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
/* 顶部操作按钮：圆形悬停底 + 按压缩放
   放入 @layer components 中，保证 Tailwind 工具类（hidden/lg:* 等）能覆盖 display */
@layer components {
  .header-icon-btn {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;

    &:hover {
      background-color: color-mix(in oklab, var(--color-base-content) 8%, transparent);
      color: color-mix(in oklab, var(--color-base-content) 95%, transparent);
    }

    &:active {
      transform: scale(0.9);
    }
  }
}
</style>
