<script setup lang="ts">
import { Icon } from '@iconify/vue';
import OnlinePlayerStats from './online-player-stats.vue';
import img196697 from '@/assets/home/196697.webp';
import img207977 from '@/assets/home/207977.webp';
import img609229 from '@/assets/home/609229.webp';
import img808042 from '@/assets/home/808042.webp';
import img911476 from '@/assets/home/911476.webp';
import img940326 from '@/assets/home/940326.webp';

defineOptions({ name: 'HeroBanner' });

/** Windows 版下载直链 */
const DOWNLOAD_URL = 'https://www.bluearchive.top/statics/soft/蔚蓝档案登录器-Windows-Setup.exe';

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

interface HeroArtSlot {
  side: 'left' | 'right';
  x: number; // %
  y: number; // %（顶部带为 top，底部带为 bottom）
  size: number; // px
  zone: 'top' | 'bottom';
}

/** 首屏边缘装饰插槽：纵向间距 > 最大图尺寸，保证互不重叠 */
const ART_SLOTS: HeroArtSlot[] = [
  { side: 'left', x: 1.5, y: 5, size: 88, zone: 'top' },
  { side: 'right', x: 4, y: 11, size: 60, zone: 'top' },
  { side: 'left', x: 5.5, y: 23, size: 72, zone: 'top' },
  { side: 'right', x: 1.5, y: 18, size: 64, zone: 'bottom' },
  { side: 'left', x: 4, y: 25, size: 80, zone: 'bottom' },
  { side: 'right', x: 5.5, y: 33, size: 52, zone: 'bottom' }
];

const ART_SOURCES = [img196697, img911476, img940326, img609229, img207977, img808042];

/** 图片随机打乱进插槽，避免重复；旋转/动画相位仍随机 */
const HERO_ARTS = seededShuffle(ART_SOURCES, 7).map((src, i) => {
  const slot = ART_SLOTS[i];
  const style: Record<string, string> = {
    [slot.side]: `${slot.x}%`,
    width: `${slot.size}px`,
    height: `${slot.size}px`,
    '--rot': `${-10 + rand(i + 107) * 20}deg`,
    '--dur': `${5 + rand(i + 108) * 4}s`,
    '--delay': `${-rand(i + 109) * 8}s`
  };
  style[slot.zone] = `${slot.y}%`;
  return { src, style };
});
</script>

<template>
  <section class="hero-banner">
    <!-- 装饰背景 -->
    <div class="hero-glow hero-glow-1" aria-hidden="true" />
    <div class="hero-glow hero-glow-2" aria-hidden="true" />

    <!-- 边缘装饰图（漂浮展示，不遮挡交互） -->
    <div class="hero-art" aria-hidden="true">
      <img
        v-for="art in HERO_ARTS"
        :key="art.src"
        :src="art.src"
        class="hero-art-img"
        :style="art.style"
        alt=""
        loading="lazy"
      />
    </div>

    <div class="hero-inner relative z-10">
      <!-- 介绍内容（首屏中部） -->
      <div class="hero-main" v-reveal="0" data-reveal="up">
        <div
          class="flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left"
        >
          <!-- 介绍文案 -->
          <div class="max-w-2xl">
            <span class="hero-badge">{{ $t('home.badge') }}</span>
            <h1 class="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {{ $t('home.title') }}
            </h1>
            <p class="mx-auto mt-4 text-sm leading-relaxed opacity-80 sm:text-base lg:mx-0">
              {{ $t('home.description') }}
            </p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a :href="DOWNLOAD_URL" target="_blank" rel="noopener noreferrer" class="hero-btn hero-btn-primary">
                {{ $t('home.downloadNow') }}
                <Icon icon="heroicons:arrow-down-tray" class="h-4 w-4" />
              </a>
              <router-link to="/server" class="hero-btn hero-btn-ghost">
                {{ $t('home.viewServer') }}
                <Icon icon="heroicons:server-stack" class="h-4 w-4" />
              </router-link>
            </div>
          </div>

          <!-- Logo 展示 -->
          <div class="hero-logo-wrap">
            <div class="hero-logo-ring" aria-hidden="true" />
            <img src="/logo.png" alt="logo" class="hero-logo" />
          </div>
        </div>
      </div>

      <!-- 在线玩家数量统计（首屏底部卡片） -->
      <div class="hero-stats" v-reveal="60" data-reveal="up">
        <OnlinePlayerStats />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(0, 150, 255, 0.05) 55%, transparent);
  border-bottom: 1px solid color-mix(in oklab, var(--color-base-content) 6%, transparent);
}

/* 首屏边缘装饰图：位于内容之下、不拦截交互 */
.hero-art {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  .hero-art-img {
    position: absolute;
    border-radius: 18px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 16px 40px rgba(0, 150, 255, 0.35);
    will-change: transform;
    animation: hero-float var(--dur) ease-in-out var(--delay) infinite alternate;
  }
}

@keyframes hero-float {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  50% {
    transform: translate3d(0, -10px, 0) rotate(var(--rot));
  }

  100% {
    transform: translate3d(0, 6px, 0) rotate(calc(var(--rot) * -0.6));
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-art-img {
    animation: none;
  }
}

@media (max-width: 1023px) {
  .hero-art {
    display: none;
  }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0 24px;
}

/* 介绍内容占满中部，垂直居中 */
.hero-main {
  flex: 1;
  display: flex;
  align-items: center;
}

/* 首屏底部统计卡片 */
.hero-stats {
  padding-top: 16px;
  width: 100%;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
}

.hero-glow-1 {
  top: -120px;
  right: -60px;
  width: 380px;
  height: 380px;
  background: rgba(56, 189, 248, 0.3);
}

.hero-glow-2 {
  bottom: -140px;
  left: -40px;
  width: 320px;
  height: 320px;
  background: rgba(0, 150, 255, 0.22);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: color-mix(in oklab, var(--color-primary) 95%, white);
  background: color-mix(in oklab, var(--color-primary) 12%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-primary) 30%, transparent);
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:active {
    transform: scale(0.97);
  }
}

.hero-btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(37, 99, 235, 0.5);
  }
}

.hero-btn-ghost {
  color: color-mix(in oklab, var(--color-base-content) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-base-content) 15%, transparent);
  background: color-mix(in oklab, var(--color-base-100) 60%, transparent);

  &:hover {
    color: color-mix(in oklab, var(--color-primary) 90%, white);
    border-color: color-mix(in oklab, var(--color-primary) 40%, transparent);
  }
}

.hero-logo-wrap {
  position: relative;
  flex-shrink: 0;
}

.hero-logo-ring {
  position: absolute;
  inset: -16px;
  border-radius: 36px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(0, 150, 255, 0.15));
  filter: blur(8px);
}

.hero-logo {
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 30px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 20px 48px rgba(0, 150, 255, 0.35);

  @media (min-width: 640px) {
    width: 160px;
    height: 160px;
  }
}
</style>
