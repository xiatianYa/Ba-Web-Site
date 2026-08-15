<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'DownloadSection' });

interface DownloadPlatform {
  key: string;
  icon: string;
  titleKey: string;
  sysKey: string;
  available: boolean;
  url: string;
}

/** 下载平台（available 为 false 的平台暂未开放下载） */
const downloadPlatforms: DownloadPlatform[] = [
  {
    key: 'windows',
    icon: 'mdi:windows',
    titleKey: 'home.download.windows',
    sysKey: 'home.download.sysWin',
    available: true,
    url: 'https://www.bluearchive.top/statics/soft/BaLuncher-Windows-Setup.exe'
  },
  {
    key: 'linux',
    icon: 'mdi:linux',
    titleKey: 'home.download.linux',
    sysKey: 'home.download.sysLinux',
    available: false,
    url: ''
  },
  {
    key: 'mac',
    icon: 'mdi:apple',
    titleKey: 'home.download.mac',
    sysKey: 'home.download.sysMac',
    available: false,
    url: ''
  }
];

/** 已开放下载的平台（用于底部辅助信息） */
const defaultPlatform = downloadPlatforms[0];
</script>

<template>
  <section id="download" class="story-section download-story">
    <div class="story-content">
      <!-- 区块标题 -->
      <div class="dl-title-area text-center" v-reveal="0" data-reveal="up">
        <h2 class="section-title justify-center">{{ $t('home.section.downloadTitle') }}</h2>
        <p class="section-desc">{{ $t('home.section.downloadDesc') }}</p>
      </div>

      <!-- 平台下载卡片（可下载卡片直接作为下载入口） -->
      <div class="dl-row mt-6" v-reveal="60" data-reveal="up">
        <a
          v-for="p in downloadPlatforms"
          :key="p.key"
          class="dl-card"
          :class="{ 'dl-card-download': p.available, 'dl-card-off': !p.available }"
          :href="p.available ? p.url : undefined"
          :target="p.available ? '_blank' : undefined"
          :rel="p.available ? 'noopener noreferrer' : undefined"
          :aria-disabled="!p.available"
          @click="!p.available && $event.preventDefault()"
        >
          <span class="dl-card-icon"><Icon :icon="p.icon" class="h-9 w-9" /></span>
          <span class="dl-card-name">{{ $t(p.titleKey) }}</span>
          <span v-if="p.available" class="dl-card-action">
            <Icon icon="heroicons:arrow-down-tray" class="h-3.5 w-3.5" />
            {{ $t('home.download.action') }}
          </span>
          <span v-else class="dl-card-soon">{{ $t('home.download.unavailable') }}</span>
        </a>
      </div>

      <!-- 辅助信息 -->
      <p class="dl-note">
        {{ $t('home.download.latest') }} {{ $t('home.download.version') }} ·
        {{ $t(defaultPlatform.sysKey) }} · {{ $t('home.download.size') }}
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 参考网易 UU 远程下载区：一排扁平白卡片，无背景、无边框、无阴影 */
.dl-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.dl-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 132px;
  min-height: 134px;
  padding: 18px 10px 14px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 10%, transparent);
  border-radius: 10px;
  background: var(--color-base-100);
  color: color-mix(in oklab, var(--color-base-content) 72%, transparent);
  text-decoration: none;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  .dl-card-icon {
    display: grid;
    place-items: center;
  }

  .dl-card-name {
    font-size: 13px;
    font-weight: 600;
  }

  .dl-card-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 4px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #38bdf8, #2563eb);
  }

  .dl-card-soon {
    margin-top: 4px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 55%, transparent);
    background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
  }
}

/* 已开放下载的卡片：蓝色强调（无边框） */
.dl-card-download {
  color: #3a7bfc;
  background: color-mix(in srgb, #3a7bfc 5%, var(--color-base-100));
}

/* 未开放平台：灰色背景区分 */
.dl-card-off {
  cursor: not-allowed;
  background: color-mix(in oklab, var(--color-base-content) 6%, var(--color-base-100));
}

.dl-note {
  margin-top: 14px;
  text-align: center;
  font-size: 12.5px;
  color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
}
</style>
