<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'PagePlaceholder' });

defineProps<{
  /** 页面标题的 i18n 键 */
  titleKey: string;
  /** 占位图标（iconify 图标名） */
  icon: string;
}>();
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-12">
    <h1 class="mb-6 text-3xl font-extrabold tracking-tight">{{ $t(titleKey) }}</h1>
    <div class="card bg-base-200">
      <div class="card-body items-center py-16 text-center">
        <Icon :icon="icon" class="h-12 w-12 opacity-40" />
        <p class="text-base-content/70">{{ $t('common.placeholder') }}</p>
      </div>
    </div>
  </div>
</template>
