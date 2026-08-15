<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useDictStore } from '@/store/modules/dict';
import { useAuthStore } from '@/store/modules/auth';
import LoginDialog from '@/components/common/login-dialog.vue';
import AppLoading from '@/components/common/app-loading.vue';
import { initOAuthCallback } from '@/hooks/business/oauth';

defineOptions({ name: 'App' });

const appStore = useAppStore();
const dictStore = useDictStore();
const authStore = useAuthStore();

/** 是否已就绪（隐藏进入加载动画） */
const isReady = ref(false);

onMounted(async () => {
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

  // 保证加载动画至少展示约 900ms，避免一闪而过
  await new Promise(resolve => setTimeout(resolve, 900));
  isReady.value = true;
});
</script>

<template>
  <RouterView />
  <LoginDialog />

  <!-- 进入网页加载动画 -->
  <Transition name="loading-fade">
    <AppLoading v-if="!isReady" />
  </Transition>
</template>

<style scoped>
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-leave-to {
  opacity: 0;
}
</style>
