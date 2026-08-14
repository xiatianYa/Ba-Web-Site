<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useDictStore } from '@/store/modules/dict';

defineOptions({ name: 'App' });

const appStore = useAppStore();
const dictStore = useDictStore();

onMounted(() => {
  // 应用挂载时初始化主题（daisyUI data-theme）
  appStore.initTheme();
  // 初始化公共数据字典（供服务器模式/类型/标签等渲染）
  dictStore.init();
});
</script>

<template>
  <RouterView />
</template>
