<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/store/modules/game';

defineOptions({ name: 'CommunityRealtime' });

const gameStore = useGameStore();

/** 社区实时在线数据（按在线人数降序） */
const items = computed(() =>
  gameStore.communityList
    .map(c => ({
      id: c.id,
      name: c.communityName,
      logo: c.logo,
      online: gameStore.communityOnlineCountMap[c.id] ?? 0,
      servers: gameStore.communityServerCountMap[c.id] ?? 0
    }))
    .sort((a, b) => b.online - a.online)
);

/** 在线人数最大值（用于进度条比例，避免除零） */
const maxOnline = computed(() => Math.max(1, ...items.value.map(i => i.online)));

const isEmpty = computed(() => items.value.length === 0);
</script>

<template>
  <div class="dash-card community-card">
    <!-- 卡片头部 -->
    <div class="dash-head">
      <div class="dash-title">
        <span class="dash-title-icon"
          ><Icon icon="heroicons:building-library" class="h-4 w-4"
        /></span>
        <div class="flex flex-col leading-tight">
          <span>{{ $t('home.dash.communityRealtime') }}</span>
          <span class="text-[11px] font-normal text-base-content/45">{{
            $t('home.dash.communityRealtimeDesc')
          }}</span>
        </div>
      </div>
      <span class="dash-live"><span class="dot" /></span>
    </div>

    <!-- 空状态 -->
    <div v-if="isEmpty" class="dash-empty">
      <Icon icon="heroicons:building-library" class="dash-empty-icon h-12 w-12" />
      <p>{{ $t('home.dash.noData') }}</p>
    </div>

    <!-- 社区列表 -->
    <div v-else class="community-list">
      <div v-for="item in items" :key="item.id" class="community-item">
        <div class="community-logo">
          <img v-if="item.logo" :src="item.logo" :alt="item.name" />
          <Icon v-else icon="heroicons:building-library" class="h-5 w-5" />
        </div>

        <div class="community-info">
          <div class="community-top">
            <span class="community-name" :title="item.name">{{ item.name }}</span>
            <span class="community-count">{{ item.online }}{{ $t('home.dash.playersOnline') }}</span>
          </div>
          <div class="community-bar">
            <div
              class="community-bar-fill"
              :style="{ width: `${(item.online / maxOnline) * 100}%` }"
            />
          </div>
          <span class="community-sub">
            {{ $t('home.dash.serversOnline') }} {{ item.servers }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.community-card {
  min-height: 320px;
  max-height: 560px;
}

.community-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: color-mix(in oklab, var(--color-base-content) 14%, transparent);
  }

  .community-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--color-base-100) 55%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-base-content) 6%, transparent);
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in oklab, var(--color-base-100) 85%, transparent);
      border-color: color-mix(in oklab, var(--color-primary) 25%, transparent);
    }

    .community-logo {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      flex-shrink: 0;
      overflow: hidden;
      color: #0ea5e9;
      background: color-mix(in oklab, var(--color-base-200) 80%, transparent);
      border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .community-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .community-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-width: 0;

        .community-name {
          font-size: 13px;
          font-weight: 600;
          color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .community-count {
          font-size: 12px;
          font-weight: 700;
          color: #0ea5e9;
          flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }
      }

      .community-bar {
        height: 5px;
        border-radius: 999px;
        background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
        overflow: hidden;

        .community-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #38bdf8, #0096ff);
          transition: width 0.5s ease;
        }
      }

      .community-sub {
        font-size: 10.5px;
        color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
      }
    }
  }
}
</style>
