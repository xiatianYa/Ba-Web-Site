<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useDictStore } from '@/store/modules/dict';
import { useAuthStore } from '@/store/modules/auth';
import LoginDialog from '@/components/common/login-dialog.vue';
import { initOAuthCallback } from '@/hooks/business/oauth';

defineOptions({ name: 'App' });

const appStore = useAppStore();
const dictStore = useDictStore();
const authStore = useAuthStore();

onMounted(() => {
  // 应用挂载时初始化主题（daisyUI data-theme）
  appStore.initTheme();
  // 初始化公共数据字典（供服务器模式/类型/标签等渲染）
  dictStore.init();
  // 处理 OAuth 回调（QQ/Steam 授权后跳回本站时解析 code / claimed_id）
  initOAuthCallback();
  // 已登录则恢复用户信息
  if (authStore.isLogin) {
    void authStore.getUserInfo();
  }
});
</script>

<template>
  <RouterView />
  <LoginDialog />
</template>
