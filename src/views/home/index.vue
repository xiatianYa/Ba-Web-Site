<script setup lang="ts">
import HeroBanner from './modules/hero-banner.vue';
import ServerCurrentOnline from './modules/server-current-online.vue';
import CommunityRealtime from './modules/community-realtime.vue';
import ServerHistoryOnline from './modules/server-history-online.vue';
import MapPlayStats from './modules/map-play-stats.vue';
import FeatureGrid from './modules/feature-grid.vue';
import UiPreview from './modules/ui-preview.vue';
import DownloadSection from './modules/download-section.vue';

defineOptions({ name: 'HomeView' });
</script>

<template>
  <div class="home-page">
    <!-- 整屏首屏：介绍登录器 -->
    <HeroBanner />

    <!-- 内容区 -->
    <div class="mx-auto w-full max-w-[140rem] px-4 py-6 sm:px-6 sm:py-8">
      <div class="flex flex-col gap-6">
        <!-- 第 1 行：服务器当前在线 + 社区实时在线 -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3" v-reveal="0" data-reveal="up">
          <ServerCurrentOnline class="lg:col-span-2" />
          <CommunityRealtime />
        </div>

        <!-- 第 2 行：历史在线 + 地图统计 -->
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2" v-reveal="60" data-reveal="up">
          <ServerHistoryOnline />
          <MapPlayStats />
        </div>

        <!-- 功能卡片 -->
        <FeatureGrid />

        <!-- 界面预览 -->
        <UiPreview />

        <!-- 各版本下载 -->
        <DownloadSection />
      </div>
    </div>
  </div>
</template>
