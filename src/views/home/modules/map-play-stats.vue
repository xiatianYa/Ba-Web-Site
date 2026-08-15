<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { fetchGetMapPlayCountList } from '@/service/api';
import { $t } from '@/locales';

defineOptions({ name: 'MapPlayStats' });

/** 排行展示条数上限 */
const DISPLAY_MAX = 10;

const loading = ref(false);
const error = ref('');
const mapPlayCountList = ref<Api.Game.GameMapPlayCountVo[]>([]);

/** 前 3 名徽章颜色，其余为中性色 */
const rankColors = ['#ff4d4f', '#faad14', '#52c41a'];

/** 游玩次数格式化（万 / k） */
const formatPlayCount = (count: number): string => {
  if (count >= 10000) {
    const w = count / 10000;
    return $t('home.dash.playCountWan', { count: w.toFixed(1) });
  }
  if (count >= 1000) {
    const k = count / 1000;
    return $t('home.dash.playCountK', { count: k.toFixed(1) });
  }
  return $t('home.dash.playCount', { count });
};

/** 按游玩次数降序排序后的排行 */
const mapPlayList = computed(() =>
  [...mapPlayCountList.value].sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, DISPLAY_MAX)
);

const isEmpty = computed(() => mapPlayList.value.length === 0);

const loadData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data, error: err } = await fetchGetMapPlayCountList();
    if (err) {
      error.value = err.message || $t('home.dash.mapPlayFetchFailed');
      return;
    }
    mapPlayCountList.value = data ?? [];
  } catch (e) {
    console.error('[MAP-PLAY-STATS] 获取地图游玩次数排行失败:', e);
    error.value = $t('home.dash.mapPlayFetchFailed');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<template>
  <div class="dash-card map-stats-card">
    <!-- 卡片头部 -->
    <div class="dash-head">
      <div class="dash-title">
        <span class="dash-title-icon"><Icon icon="heroicons:map" class="h-4 w-4" /></span>
        <div class="flex flex-col leading-tight">
          <span>{{ $t('home.dash.mapStats') }}</span>
          <span class="text-[11px] font-normal text-base-content/45">{{
            $t('home.dash.mapStatsDesc')
          }}</span>
        </div>
      </div>
    </div>

    <!-- 加载中骨架屏 -->
    <div v-if="loading" class="map-list">
      <div v-for="i in 6" :key="i" class="map-item map-item-skeleton">
        <div class="map-rank" />
        <div class="map-info">
          <div class="skeleton-line w-3/4" />
          <div class="skeleton-line w-1/2" />
        </div>
        <div class="skeleton-line w-14" />
      </div>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="dash-empty">
      <Icon icon="heroicons:map" class="dash-empty-icon h-12 w-12" />
      <p>{{ error }}</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="dash-empty">
      <Icon icon="heroicons:map" class="dash-empty-icon h-12 w-12" />
      <p>{{ $t('home.dash.noData') }}</p>
    </div>

    <!-- 排行列表 -->
    <div v-else class="map-list">
      <div v-for="(item, index) in mapPlayList" :key="item.mapId || index" class="map-item">
        <div class="map-rank" :class="index < 3 ? `rank-${index + 1}` : 'rank-default'">
          {{ index + 1 }}
        </div>
        <div class="map-info">
          <div class="map-name" :title="item.mapLabel || item.mapName">
            {{ item.mapLabel || item.mapName }}
          </div>
          <div class="map-sub" :title="item.mapName">{{ item.mapName }}</div>
        </div>
        <div class="map-count" :style="index < 3 ? { color: rankColors[index] } : {}">
          {{ formatPlayCount(item.playCount || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-stats-card {
  min-height: 320px;
}

.map-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: color-mix(in oklab, var(--color-base-content) 14%, transparent);
  }

  .map-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: color-mix(in oklab, var(--color-base-100) 55%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-base-content) 6%, transparent);
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in oklab, var(--color-base-100) 85%, transparent);
      border-color: color-mix(in oklab, var(--color-primary) 25%, transparent);
    }

    .map-rank {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
    }

    .rank-1 {
      color: #fff;
      background: linear-gradient(135deg, #ff7a7c, #ff4d4f);
    }

    .rank-2 {
      color: #fff;
      background: linear-gradient(135deg, #ffc53d, #faad14);
    }

    .rank-3 {
      color: #fff;
      background: linear-gradient(135deg, #73d13d, #52c41a);
    }

    .rank-default {
      color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
      background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
    }

    .map-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .map-name {
        font-size: 12.5px;
        font-weight: 600;
        color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .map-sub {
        font-size: 10.5px;
        color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .map-count {
      flex-shrink: 0;
      font-size: 12.5px;
      font-weight: 700;
      color: color-mix(in oklab, var(--color-base-content) 70%, transparent);
      font-variant-numeric: tabular-nums;
    }
  }

  /* 骨架屏行 */
  .map-item-skeleton {
    cursor: default;

    .map-rank {
      background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
    }
  }
}

.skeleton-line {
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    color-mix(in oklab, var(--color-base-content) 6%, transparent),
    color-mix(in oklab, var(--color-base-content) 14%, transparent),
    color-mix(in oklab, var(--color-base-content) 6%, transparent)
  );
  background-size: 200% 100%;
  animation: skeletonShimmer 1.4s ease-in-out infinite;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
