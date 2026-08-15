<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { i18n, $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { fetchGetCommunityOnlineBar } from '@/service/api';
import { ECOption, useEcharts } from '@/hooks/common/echarts';
import type { BarSeriesOption } from 'echarts/charts';

defineOptions({ name: 'ServerHistoryOnline' });

const appStore = useAppStore();

/* ===== 时间范围选择 ===== */

const HOUR_OPTIONS = [
  { labelKey: 'home.dash.timeRangeOneDay', value: 24 },
  { labelKey: 'home.dash.timeRangeThreeDays', value: 72 },
  { labelKey: 'home.dash.timeRangeOneWeek', value: 168 }
];
const selectedHours = ref(24);

/* ===== 柱状图数据 ===== */

const loading = ref(false);
const error = ref('');
const chartData = ref<Api.Game.CommunityOnlineBarVo | null>(null);

/** 社区颜色板（明 → 暗渐变配色） */
const SERIES_COLORS = [
  ['#8b9cf7', '#667eea'], // 紫
  ['#5df0a0', '#43e97b'], // 绿
  ['#f5b745', '#f0a020'], // 金
  ['#6ec0ff', '#4facfe'], // 蓝
  ['#f77a8a', '#f5576c'], // 红
  ['#9da7f9', '#7c8cf8'], // 浅紫
  ['#34d6d6', '#13c2c2'], // 青
  ['#fca540', '#fa8c16'], // 橙
  ['#f05ba8', '#eb2f96'], // 粉
  ['#8e4ae1', '#722ed1']  // 深紫
];

/** 时间轴标签最大显示数 */
const MAX_X_LABELS = 6;

/* ===== ECharts 柱状图配置 ===== */

const buildBarOptions = (data: Api.Game.CommunityOnlineBarVo): ECOption => {
  const { timeAxis, series } = data;
  const dataLength = timeAxis.length;
  const isDark = appStore.darkMode;

  const labelInterval = (index: number) => {
    if (dataLength <= MAX_X_LABELS) return true;
    const step = Math.floor(dataLength / (MAX_X_LABELS - 1));
    return index % step === 0;
  };

  const barSeries: BarSeriesOption[] = series.map((s, i) => {
    const [light, dark] = SERIES_COLORS[i % SERIES_COLORS.length];
    return {
      name: s.communityName,
      type: 'bar',
      data: s.data,
      barGap: '30%',
      barCategoryGap: '40%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: light },
            { offset: 1, color: dark }
          ]
        }
      },
      emphasis: {
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          shadowBlur: 12,
          shadowOffsetY: 3,
          shadowColor: 'rgba(0, 0, 0, 0.15)'
        }
      },
      barMaxWidth: 28
    };
  });

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
        }
      },
      backgroundColor: isDark ? 'rgba(28, 33, 48, 0.96)' : 'rgba(255, 255, 255, 0.96)',
      borderColor: isDark ? 'rgba(102, 126, 234, 0.25)' : 'rgba(102, 126, 234, 0.3)',
      borderWidth: 1,
      borderRadius: 10,
      padding: [10, 14],
      textStyle: { color: isDark ? '#e8ecf4' : '#2e2b26', fontSize: 12, fontWeight: 500 },
      extraCssText: isDark
        ? 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); backdrop-filter: blur(8px);'
        : 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); backdrop-filter: blur(8px);'
    },
    legend: {
      type: 'scroll',
      bottom: 4,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      textStyle: { fontSize: 11 },
      pageIconColor: '#667eea',
      pageIconSize: 12,
      pageTextStyle: { fontSize: 11 }
    },
    grid: {
      left: 8,
      right: 16,
      top: 12,
      bottom: 44,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeAxis,
      axisLabel: {
        fontSize: 10,
        interval: labelInterval,
        rotate: dataLength > 12 ? 30 : 0
      },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: $t('home.dash.onlineUser'),
      nameTextStyle: { fontSize: 10, fontWeight: 500 },
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: barSeries
  };
};

/* ===== ECharts 实例 ===== */

const { domRef, updateOptions } = useEcharts<ECOption>(() => ({}), {
  onUpdated: instance => {
    instance.hideLoading();
  }
});

/** 图表是否为空 */
const isBarEmpty = computed(() => !chartData.value || chartData.value.series.length === 0);

/* ===== 数据获取 ===== */

const fetchBarData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data, error: err } = await fetchGetCommunityOnlineBar(selectedHours.value);
    if (err) {
      error.value = err.message || $t('home.dash.historyFetchFailed');
      return;
    }
    if (!data || !data.series || data.series.length === 0) {
      chartData.value = null;
      return;
    }
    chartData.value = data;
    await updateOptions(() => buildBarOptions(chartData.value!));
  } catch (e) {
    console.error('[SERVER-HISTORY] 获取历史在线人数失败:', e);
    error.value = $t('home.dash.historyFetchFailed');
  } finally {
    loading.value = false;
  }
};

/** 切换时间范围 */
const handleHoursChange = (hours: number) => {
  if (selectedHours.value === hours) return;
  selectedHours.value = hours;
  fetchBarData();
};

onMounted(fetchBarData);

// 主题切换时重新渲染图表，让 ECharts 的 dark/light 主题 + tooltip 配色同步生效
watch(
  () => appStore.darkMode,
  () => {
    if (chartData.value) {
      updateOptions(() => buildBarOptions(chartData.value!));
    }
  }
);

// 语言切换时重新渲染图表，让 y 轴名称 / tooltip 等 $t 文案同步更新
watch(
  () => i18n.global.locale.value,
  () => {
    if (chartData.value) {
      updateOptions(() => buildBarOptions(chartData.value!));
    }
  }
);
</script>

<template>
  <div class="dash-card history-card">
    <!-- 卡片头部：标题 / 时间范围 -->
    <div class="dash-head">
      <div class="dash-title">
        <span class="dash-title-icon"><Icon icon="heroicons:chart-bar" class="h-4 w-4" /></span>
        <span>{{ $t('home.dash.historyOnline') }}</span>
      </div>
      <div class="hours-selector">
        <button
          v-for="opt in HOUR_OPTIONS"
          :key="opt.value"
          class="hours-btn"
          :class="{ active: selectedHours === opt.value }"
          @click="handleHoursChange(opt.value)"
        >
          {{ $t(opt.labelKey) }}
        </button>
      </div>
    </div>

    <!-- 加载中骨架屏 -->
    <div v-if="loading" class="chart-skeleton">
      <div class="skeleton-bars">
        <div
          v-for="i in 8"
          :key="i"
          class="skeleton-bar"
          :style="{ height: `${15 + ((i * 7) % 6) * 14}%`, animationDelay: `${(i % 5) * 0.12}s` }"
        />
      </div>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="dash-empty">
      <Icon icon="heroicons:chart-bar" class="dash-empty-icon h-12 w-12" />
      <p>{{ error }}</p>
    </div>

    <!-- 空数据 -->
    <div v-else-if="isBarEmpty" class="dash-empty">
      <Icon icon="heroicons:chart-bar" class="dash-empty-icon h-12 w-12" />
      <p>{{ $t('home.dash.noData') }}</p>
    </div>

    <!-- 图表 -->
    <div v-else ref="domRef" class="chart-container" />
  </div>
</template>

<style scoped lang="scss">
.history-card {
  min-height: 320px;
}

/* 时间范围选择器 */
.hours-selector {
  display: flex;
  gap: 4px;
  padding: 2px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--color-base-content) 5%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);

  .hours-btn {
    padding: 3px 9px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;

    &:hover {
      color: color-mix(in oklab, var(--color-base-content) 75%, transparent);
      background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
    }

    &.active {
      color: #fff;
      background: linear-gradient(135deg, #38bdf8, #0096ff);
      box-shadow: 0 2px 8px rgba(0, 150, 255, 0.35);
    }
  }
}

/* 图表容器 */
.chart-container {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/* 骨架屏 */
.chart-skeleton {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 0 4px;

  .skeleton-bars {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 100%;

    .skeleton-bar {
      flex: 1;
      border-radius: 4px 4px 0 0;
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--color-base-content) 12%, transparent) 0%,
        color-mix(in oklab, var(--color-base-content) 4%, transparent) 100%
      );
      animation: skeletonPulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 0.8;
  }
}
</style>
