<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { NAV_MENUS, isMenuActive } from '@/constants/menu';
import { cn } from '@/utils/common';

defineOptions({ name: 'AppSidebar' });

const props = defineProps<{
  /** PC 端折叠状态（仅图标） */
  collapsed: boolean;
  /** 移动端抽屉展开状态 */
  mobileOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'closeMobile'): void;
}>();

const route = useRoute();

/** 菜单项激活态 */
const isActive = (path: string) => isMenuActive(path, route.path);

/** PC 侧边栏宽度类 */
const asideClass = computed(() => (props.collapsed ? 'lg:w-[72px]' : 'lg:w-56'));

/** 菜单项容器 class：折叠时仅图标居中 */
const itemClass = (active: boolean) =>
  cn(
    'group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
    props.collapsed ? 'justify-center px-0 mx-2' : 'px-4 mx-2',
    active
      ? 'bg-primary/10 text-primary'
      : 'text-base-content/60 hover:bg-base-200/70 hover:text-base-content'
  );
</script>

<template>
  <!-- PC 端固定侧边栏 -->
  <aside
    :class="asideClass"
    class="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-base-300/60 bg-base-100 transition-[width] duration-300 lg:flex"
  >
    <!-- 品牌 -->
    <router-link
      to="/"
      class="flex h-16 shrink-0 items-center gap-2.5 overflow-hidden px-4"
      :class="collapsed ? 'justify-center px-0' : ''"
    >
      <img src="/logo.png" class="h-9 w-9 shrink-0 rounded-xl object-cover" alt="logo" />
      <span v-if="!collapsed" class="truncate text-lg font-extrabold tracking-tight">{{
        $t('system.title')
      }}</span>
    </router-link>

    <!-- 菜单 -->
    <nav class="flex-1 space-y-1 overflow-y-auto py-4">
      <router-link
        v-for="item in NAV_MENUS"
        :key="item.name"
        :to="item.path"
        :class="itemClass(isActive(item.path))"
        :title="collapsed ? $t(item.titleKey) : undefined"
      >
        <!-- 激活指示条 -->
        <span
          class="absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-opacity duration-200"
          :class="isActive(item.path) ? 'opacity-100' : 'opacity-0'"
        />
        <Icon :icon="item.icon" class="h-5 w-5 shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ $t(item.titleKey) }}</span>
      </router-link>
    </nav>

    <!-- 底部装饰 -->
    <div class="shrink-0 border-t border-base-300/60 p-4 text-center">
      <span
        v-if="!collapsed"
        class="text-xs font-semibold uppercase tracking-wider text-base-content/30"
      >
        {{ $t('footer.brand') }}
      </span>
      <Icon v-else icon="heroicons:bolt" class="mx-auto h-4 w-4 text-primary/50" />
    </div>
  </aside>

  <!-- 移动端抽屉（无模糊遮罩，点击外部关闭） -->
  <Transition name="drawer">
    <div v-if="mobileOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/25" @click="emit('closeMobile')" />
      <div
        class="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-base-300/60 bg-base-100 shadow-2xl"
      >
        <!-- 品牌 -->
        <div class="flex h-16 shrink-0 items-center justify-between border-b border-base-300/60 px-4">
          <router-link to="/" class="flex items-center gap-2.5" @click="emit('closeMobile')">
            <img src="/logo.png" class="h-9 w-9 rounded-xl object-cover" alt="logo" />
            <span class="text-lg font-extrabold tracking-tight">{{ $t('system.title') }}</span>
          </router-link>
          <button
            class="btn btn-ghost btn-circle btn-sm"
            :aria-label="$t('nav.toggleMenu')"
            @click="emit('closeMobile')"
          >
            <Icon icon="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </div>

        <!-- 菜单 -->
        <nav class="flex-1 space-y-1 overflow-y-auto py-4">
          <router-link
            v-for="item in NAV_MENUS"
            :key="item.name"
            :to="item.path"
            class="group relative mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
            :class="
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-base-content/60 hover:bg-base-200/70 hover:text-base-content'
            "
            @click="emit('closeMobile')"
          >
            <span
              class="absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-opacity duration-200"
              :class="isActive(item.path) ? 'opacity-100' : 'opacity-0'"
            />
            <Icon :icon="item.icon" class="h-5 w-5 shrink-0" />
            <span class="truncate">{{ $t(item.titleKey) }}</span>
          </router-link>
        </nav>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 移动端抽屉滑入动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  > div:last-child {
    transform: translateX(-100%);
  }
}
</style>
