<script setup lang="ts">
import AppNavbar from '@/components/common/AppNavbar.vue';

defineOptions({ name: 'DefaultLayout' });
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 通用导航栏：桌面端分段式菜单 / 移动端下拉菜单 -->
    <AppNavbar />

    <!-- 主内容区：带页面切换过渡动画 -->
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-base-300 bg-base-200/50">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-sm text-base-content/60 sm:flex-row sm:justify-between"
      >
        <span class="flex items-center gap-2">
          <span class="font-semibold text-base-content/80">{{ $t('system.title') }}</span>
          <span>{{ $t('footer.brand') }}</span>
        </span>
        <span>{{ $t('footer.techStack') }}</span>
      </div>
    </footer>
  </div>
</template>
