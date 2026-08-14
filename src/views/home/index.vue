<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { vReveal } from '@/directives/reveal';

defineOptions({ name: 'HomeView' });

/** 下载平台（available 为 false 的平台暂未开放下载） */
const downloadPlatforms = [
  {
    key: 'windows',
    icon: 'mdi:windows',
    titleKey: 'home.download.windows',
    available: true,
    url: 'https://www.bluearchive.top/statics/soft/蔚蓝档案登录器-Windows-Setup.exe'
  },
  {
    key: 'linux',
    icon: 'mdi:linux',
    titleKey: 'home.download.linux',
    available: false,
    url: ''
  },
  {
    key: 'mac',
    icon: 'mdi:apple',
    titleKey: 'home.download.mac',
    available: false,
    url: ''
  }
];
</script>

<template>
  <div class="mx-auto w-full max-w-[140rem] px-4 py-8 sm:px-6 sm:py-10">
    <!-- 下载板块 -->
    <section class="module" v-reveal="0" data-reveal="up">
      <h2 class="section-head">
        <span class="section-head-icon"><Icon icon="heroicons:arrow-down-tray" /></span>
        {{ $t('home.section.downloadTitle') }}
      </h2>

      <p class="mb-3 text-xs text-base-content/60">{{ $t('home.section.downloadDesc') }}</p>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="(platform, i) in downloadPlatforms"
          :key="platform.key"
          class="dl-card"
          v-reveal="i * 120"
          data-reveal="up"
        >
          <div class="dl-body">
            <Icon :icon="platform.icon" class="h-9 w-9 text-base-content/80" />
            <h3 class="mt-2 text-lg font-bold">{{ $t(platform.titleKey) }}</h3>
            <p class="text-sm text-base-content/50">{{ $t('home.download.latest') }}</p>
            <a v-if="platform.available" :href="platform.url" class="btn-dl btn-dl-primary">
              {{ $t('home.download.action') }}
              <Icon icon="heroicons:arrow-down-tray" class="h-4 w-4" />
            </a>
            <button v-else disabled class="btn-dl">
              {{ $t('home.download.unavailable') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ============ 视口入场动画 ============ */
.reveal {
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.reveal-init {
  opacity: 0;
  transform: translateY(28px);
}

.reveal-visible {
  opacity: 1;
  transform: none;
}

/* ============ 下载板块 ============ */
.module {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: color-mix(in oklab, var(--color-base-200) 88%, transparent);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 17px;
  font-weight: 800;
  color: color-mix(in oklab, var(--color-base-content) 88%, transparent);

  &::before {
    content: '';
    width: 5px;
    height: 20px;
    border-radius: 3px;
    background: linear-gradient(180deg, #38bdf8, #0096ff);
    box-shadow: 0 0 8px rgba(0, 150, 255, 0.5);
  }

  .section-head-icon {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    color: #fff;
    background: linear-gradient(135deg, #38bdf8, #0096ff);
    box-shadow: 0 3px 10px rgba(0, 150, 255, 0.35);
  }
}

.dl-card {
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: color-mix(in oklab, var(--color-base-100) 90%, transparent);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  .dl-body {
    padding: 24px 16px;
    text-align: center;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(0, 150, 255, 0.18);
  }
}

.btn-dl {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 34px;
  margin-top: 12px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-dl-primary {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.45);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
}

/* ============ 减弱动态偏好 ============ */
@media (prefers-reduced-motion: reduce) {
  .reveal-init {
    opacity: 1;
    transform: none;
  }
}
</style>
