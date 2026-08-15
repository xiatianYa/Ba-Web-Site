<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ALuoNa01 from '@/assets/loading/ALuoNa01.png';
import ALuoNa02 from '@/assets/loading/ALuoNa02.png';
import ALuoNa03 from '@/assets/loading/ALuoNa03.png';
import ALuoNa04 from '@/assets/loading/ALuoNa04.png';

defineOptions({ name: 'AppLoading' });

/** 轮播图列表（切换展示，营造登录器启动氛围） */
const images = [ALuoNa01, ALuoNa02, ALuoNa03, ALuoNa04];

const currentIndex = ref(0);
let timer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 900);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<template>
  <div class="app-loading" role="status" aria-live="polite">
    <!-- 背景辉光装饰 -->
    <div class="app-loading-glow" aria-hidden="true" />

    <div class="app-loading-content">
      <img :src="images[currentIndex]" class="app-loading-img" alt="" />
      <span class="app-loading-text">{{ $t('common.loading') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-base-100);
  overflow: hidden;
}

/* 背景辉光 */
.app-loading-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 560px;
  height: 560px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(56, 189, 248, 0.18) 0%,
    rgba(0, 150, 255, 0.06) 55%,
    transparent 75%
  );
  filter: blur(40px);
  pointer-events: none;
}

.app-loading-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.app-loading-img {
  width: 210px;
  height: 315px;
  object-fit: contain;
  animation: loading-float 2.5s ease-in-out infinite;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.35));
}

.app-loading-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 6px;
  color: color-mix(in oklab, var(--color-base-content) 78%, transparent);
  animation: loading-pulse 1.8s ease-in-out infinite;
}

@keyframes loading-float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-16px) scale(1.02);
  }
}

@keyframes loading-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
