<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue';
import FloatingIcons from '@/components/common/FloatingIcons.vue';

defineOptions({ name: 'DefaultLayout' });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 全局背景漂浮装饰图标（位于所有页面内容之下，不遮挡交互） -->
    <FloatingIcons />

    <!-- 顶部导航栏 -->
    <AppHeader />

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
            Copyright MIT © 2024 - 2026 夏天
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
</template>
