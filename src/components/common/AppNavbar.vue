<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { i18n, setLocale } from '@/locales';
import { LANG_OPTIONS } from '@/constants/app';
import { useTheme } from '@/hooks/common/use-theme';
import { cn } from '@/utils/common';

defineOptions({ name: 'AppNavbar' });

/** 导航菜单（新增页面时在此追加，titleKey 对应 locales 中的翻译键） */
const menus = [
  { name: 'home', path: '/', titleKey: 'routes.home', icon: 'heroicons:home' },
  { name: 'server', path: '/server', titleKey: 'routes.server', icon: 'heroicons:server-stack' },
  { name: 'tools', path: '/tools', titleKey: 'routes.tools', icon: 'heroicons:wrench-screwdriver' },
  { name: 'setting', path: '/setting', titleKey: 'routes.setting', icon: 'heroicons:cog-6-tooth' },
  { name: 'about', path: '/about', titleKey: 'routes.about', icon: 'heroicons:information-circle' }
];

const { darkMode, toggleDarkMode } = useTheme();
const route = useRoute();

/** 移动端菜单展开状态 */
const mobileOpen = ref(false);

/** 当前语言 */
const currentLocale = computed(() => i18n.global.locale.value);

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

/** 切换语言 */
function handleSwitchLang(value: App.I18n.LangType) {
  setLocale(value);
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
          :aria-label="$t('nav.toggleMenu')"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon
            :icon="mobileOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
            class="h-5 w-5"
          />
        </button>

        <!-- 品牌：渐变 Logo + 名称 -->
        <router-link to="/" class="flex items-center gap-2 px-2">
          <span
            class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20"
          >
            <Icon icon="heroicons:bolt" class="h-5 w-5" />
          </span>
          <span class="text-lg font-extrabold tracking-tight">{{ $t('system.title') }}</span>
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
              cn(
                isActive(item.path)
                  ? 'bg-base-100 text-primary shadow-sm'
                  : 'text-base-content/60 hover:bg-base-100/60 hover:text-base-content'
              )
            "
          >
            <Icon :icon="item.icon" class="h-4 w-4" />
            {{ $t(item.titleKey) }}
          </router-link>
        </div>
      </div>

      <!-- 右侧：语言切换 + 主题切换 -->
      <div class="navbar-end">
        <!-- 语言切换 -->
        <div class="dropdown dropdown-end">
          <button
            tabindex="0"
            class="btn btn-ghost btn-circle"
            :aria-label="$t('nav.switchLanguage')"
          >
            <Icon icon="heroicons:language" class="h-5 w-5" />
          </button>
          <ul
            tabindex="0"
            class="dropdown-content menu z-10 mt-2 w-40 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
          >
            <li v-for="opt in LANG_OPTIONS" :key="opt.value">
              <a
                :class="cn('justify-between', currentLocale === opt.value && 'menu-active')"
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
          class="btn btn-ghost btn-circle"
          :aria-label="$t('nav.toggleTheme')"
          @click="toggleDarkMode"
        >
          <Icon :icon="darkMode ? 'heroicons:sun' : 'heroicons:moon'" class="h-5 w-5" />
        </button>
      </div>
    </nav>

    <!-- 移动端：浮动菜单（贴附导航栏下方悬浮，不占位、不遮罩） -->
    <Transition name="floating-menu">
      <div
        v-if="mobileOpen"
        class="absolute inset-x-0 top-full border-t border-base-300 bg-base-100 shadow-lg lg:hidden"
      >
        <nav class="mx-auto max-w-6xl px-4 py-3">
          <ul class="flex flex-col gap-1">
            <li v-for="item in menus" :key="item.name">
              <router-link
                :to="item.path"
                class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                :class="
                  cn(
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/70 hover:bg-base-200'
                  )
                "
              >
                <Icon :icon="item.icon" class="h-5 w-5" />
                {{ $t(item.titleKey) }}
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
