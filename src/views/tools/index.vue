<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'ToolsView' });
</script>

<template>
  <div class="mx-auto flex w-full max-w-[140rem] items-center justify-center px-4 py-24 sm:px-6">
    <div class="flex flex-col items-center gap-4 text-center">
      <span
        class="grid h-16 w-16 animate-pulse place-items-center rounded-2xl bg-primary/10 text-primary"
      >
        <Icon icon="heroicons:wrench-screwdriver" class="h-8 w-8" />
      </span>
      <h1 class="text-2xl font-extrabold">{{ $t('routes.tools') }}</h1>
      <p class="text-base-content/60">{{ $t('common.developing') }}</p>
    </div>
  </div>
</template>
