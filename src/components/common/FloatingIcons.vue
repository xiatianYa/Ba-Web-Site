<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'FloatingIcons' });

interface FloatItem {
  icon: string;
  left: number; // %
  top: number; // %
  size: number; // px
  opacity: number;
  color: string;
  duration: number; // s
  delay: number; // s（负数让各图标从不同相位开始，视觉更自然）
  drift: number; // px
  rotate: number; // deg
}

/** 图标池：星星 / 四角星 / 雪花 / 闪电 / 太阳 / 月亮 / 云朵 */
const ICON_POOL = [
  'star',
  'sparkle',
  'snowflake',
  'lightning-bolt',
  'sun',
  'moon',
  'cloud',
  'bolt',
  'sparkle',
  'star'
];

/** 装饰色板（多彩糖果色） */
const COLORS = [
  '#38bdf8', // 天蓝
  '#fb7185', // 珊瑚红
  '#fbbf24', // 琥珀黄
  '#c084fc', // 紫
  '#4ade80', // 嫩绿
  '#f472b6', // 粉
  '#2dd4bf', // 青
  '#fb923c' // 橙
];

/** 确定性伪随机：同一序号每次渲染取值一致，避免闪烁 */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const items: FloatItem[] = Array.from({ length: 30 }, (_, i) => ({
  icon: ICON_POOL[i % ICON_POOL.length],
  left: Math.round(rand(i + 1) * 94),
  top: Math.round(rand(i + 2) * 92),
  size: 8 + Math.round(rand(i + 3) * 26),
  opacity: 0.2 + rand(i + 4) * 0.3,
  color: COLORS[i % COLORS.length],
  duration: 4.5 + rand(i + 5) * 5,
  delay: -(rand(i + 6) * 8),
  drift: 12 + rand(i + 7) * 22,
  rotate: -18 + rand(i + 8) * 36
}));
</script>

<template>
  <div class="floating-icons" aria-hidden="true">
    <Icon
      v-for="(item, i) in items"
      :key="i"
      :icon="`heroicons:${item.icon}`"
      class="floating-icon"
      :style="{
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        opacity: item.opacity,
        color: item.color,
        '--dur': `${item.duration}s`,
        '--delay': `${item.delay}s`,
        '--y1': `${-item.drift * 0.5}px`,
        '--y2': `${item.drift}px`,
        '--r1': `${item.rotate * 0.5}deg`,
        '--r2': `${item.rotate}deg`
      }"
    />
  </div>
</template>

<style scoped lang="scss">
/* 全局背景装饰层：固定全屏、低层级位于页面内容之上但远低于顶栏/弹窗，
   并通过 pointer-events: none 保证不拦截任何交互 */
.floating-icons {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;

  .floating-icon {
    position: absolute;
    will-change: transform;
    animation: float-drift var(--dur) ease-in-out var(--delay) infinite alternate;
  }
}

@keyframes float-drift {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(0, var(--y2), 0) rotate(var(--r2));
  }
  100% {
    transform: translate3d(0, var(--y1), 0) rotate(var(--r1));
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-icons {
    display: none;
  }
}
</style>
