<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';

defineOptions({ name: 'App' });

const appStore = useAppStore();

onMounted(() => {
  // 应用挂载时初始化主题（daisyUI data-theme）
  appStore.initTheme();
});
</script>

<template>
  <RouterView />
</template>
