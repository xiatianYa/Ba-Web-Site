<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';

defineOptions({ name: 'DefaultLayout' });

const route = useRoute();

/** PC 端侧边栏折叠状态（持久化到本地存储） */
const siderCollapsed = ref(localStg.get(APP_STORAGE_KEYS.SIDER_COLLAPSED) === true);

function toggleSider() {
  siderCollapsed.value = !siderCollapsed.value;
  localStg.set(APP_STORAGE_KEYS.SIDER_COLLAPSED, siderCollapsed.value);
}

/** 移动端侧边栏抽屉状态（路由切换自动关闭） */
const mobileSidebarOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    mobileSidebarOpen.value = false;
  }
);
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 左侧导航栏（PC 固定 / 移动端抽屉） -->
    <AppSidebar
      :collapsed="siderCollapsed"
      :mobile-open="mobileSidebarOpen"
      @close-mobile="mobileSidebarOpen = false"
    />

    <!-- 右侧内容区 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 顶部栏（折叠/菜单按钮 + 当前页标题 + 语言/主题） -->
      <AppHeader
        :collapsed="siderCollapsed"
        @toggle-sider="toggleSider"
        @open-mobile="mobileSidebarOpen = true"
      />

      <!-- 主内容区：带页面切换过渡动画 -->
      <main class="flex-1">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <!-- 页脚（备案信息） -->
      <footer class="border-t border-base-300 bg-base-200/50">
        <div
          class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-sm text-base-content/60 sm:flex-row sm:justify-center"
        >
          <span class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://github.com/xiatianYa"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-primary"
            >
              Copyright MIT © 2024 夏天
            </a>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-primary"
            >
              湘ICP备2024066741号-1
            </a>
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>
