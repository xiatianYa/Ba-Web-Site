<script setup lang="ts">
import { Icon } from '@iconify/vue';
import img451044 from '@/assets/home/451044.webp';
import img766184 from '@/assets/home/766184.webp';

defineOptions({ name: 'FeatureGrid' });

/** 功能列表（icon 对应 plugins/icons.ts 注册图标） */
const FEATURES = [
  { key: 'query', icon: 'heroicons:magnifying-glass' },
  { key: 'community', icon: 'heroicons:building-library' },
  { key: 'join', icon: 'heroicons:cursor-arrow-rays' },
  { key: 'autoJoin', icon: 'heroicons:bolt' },
  { key: 'copy', icon: 'heroicons:clipboard-document' },
  { key: 'refresh', icon: 'heroicons:arrow-path' },
  { key: 'auth', icon: 'heroicons:key' },
  { key: 'stats', icon: 'heroicons:chart-bar' }
];

/** 确定性伪随机：同一序号每次渲染取值一致，避免闪烁 */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 洗牌（Fisher–Yates，确定性种子） */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand(seed + i) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 功能区装饰插槽（固定间隔，保证互不重叠） */
const GRID_ART_SLOTS = [
  { side: 'left', x: 2, y: 6, size: 72, zone: 'top' },
  { side: 'right', x: 2, y: 10, size: 60, zone: 'bottom' }
];

const GRID_ART_SOURCES = [img451044, img766184];

const GRID_ARTS = seededShuffle(GRID_ART_SOURCES, 11).map((src, i) => {
  const slot = GRID_ART_SLOTS[i];
  const style: Record<string, string> = {
    [slot.side]: `${slot.x}%`,
    width: `${slot.size}px`,
    height: `${slot.size}px`,
    transform: `rotate(${-8 + rand(i + 207) * 16}deg)`
  };
  style[slot.zone] = `${slot.y}%`;
  return { src, style };
});
</script>

<template>
  <section class="story-section feature-story">
    <!-- 角落装饰图 -->
    <img
      v-for="art in GRID_ARTS"
      :key="art.src"
      :src="art.src"
      class="feature-art"
      :style="art.style"
      alt=""
      aria-hidden="true"
      loading="lazy"
    />

    <div class="story-content">
      <!-- 区块标题 -->
      <div class="feature-title-area text-center" v-reveal="0" data-reveal="up">
        <h2 class="section-title justify-center">{{ $t('home.section.featuresTitle') }}</h2>
        <p class="section-desc">{{ $t('home.section.featuresDesc') }}</p>
      </div>

      <!-- 功能卡片（整行一个动画） -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" v-reveal="60" data-reveal="up">
        <div v-for="item in FEATURES" :key="item.key" class="feature-card">
          <span class="feature-icon"><Icon :icon="item.icon" class="h-5 w-5" /></span>
          <h3 class="feature-title">{{ $t(`home.feature.${item.key}.title`) }}</h3>
          <p class="feature-desc">{{ $t(`home.feature.${item.key}.desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 功能区角落装饰图：位于内容之下、不拦截交互 */
.feature-story {
  .story-content {
    position: relative;
    z-index: 1;
  }
}

.feature-art {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  border-radius: 16px;
  object-fit: cover;
  opacity: 0.5;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 12%, transparent);
  box-shadow: 0 12px 30px rgba(0, 150, 255, 0.18);
  filter: saturate(0.92);
}

@media (max-width: 1023px) {
  .feature-art {
    display: none;
  }
}

.feature-card {
  height: 100%;
  padding: 20px 18px;
  border-radius: 16px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: color-mix(in oklab, var(--color-base-200) 55%, transparent);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: color-mix(in oklab, var(--color-primary) 30%, transparent);
    box-shadow: 0 14px 30px rgba(0, 150, 255, 0.14);
  }

  .feature-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(135deg, #38bdf8, #0096ff);
    box-shadow: 0 4px 12px rgba(0, 150, 255, 0.35);
  }

  .feature-title {
    margin-top: 14px;
    font-size: 15px;
    font-weight: 700;
    color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
  }

  .feature-desc {
    margin-top: 6px;
    font-size: 12.5px;
    line-height: 1.6;
    color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
  }
}
</style>
