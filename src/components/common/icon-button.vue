<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'IconButton' });

defineProps<{
  /** 图标名（iconify 格式，如 heroicons:moon）；不传时使用默认插槽渲染自定义内容 */
  icon?: string;
  /** 无障碍标签 */
  label?: string;
  /** 悬停提示 */
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    class="icon-btn"
    :aria-label="label"
    :title="title"
    @click="emit('click')"
  >
    <slot>
      <Icon v-if="icon" :icon="icon" class="h-5 w-5" />
    </slot>
  </button>
</template>

<style scoped lang="scss">
/* 顶部通用图标按钮：简洁圆角矩形 + 柔和悬停/按压反馈
   放入 @layer components，保证 Tailwind 工具类（hidden/lg:* 等）能覆盖 display */
@layer components {
  .icon-btn {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: color-mix(in oklab, var(--color-base-content) 55%, transparent);
    cursor: pointer;
    transition:
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.15s ease,
      box-shadow 0.18s ease;

    &:hover {
      background-color: color-mix(in oklab, var(--color-base-content) 8%, transparent);
      color: color-mix(in oklab, var(--color-base-content) 95%, transparent);
    }

    &:active {
      transform: scale(0.92);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary) 55%, transparent);
    }
  }
}
</style>
