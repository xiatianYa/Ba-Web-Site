<script setup lang="ts">
import { useTheme } from '@/hooks/common/use-theme';
import IconButton from './icon-button.vue';

defineOptions({ name: 'ThemeSwitch' });

const { darkMode, toggleDarkMode } = useTheme();
</script>

<template>
  <IconButton
    :icon="darkMode ? 'heroicons:sun' : 'heroicons:moon'"
    :label="$t('nav.toggleTheme')"
    :title="$t('nav.toggleTheme')"
    @click="toggleDarkMode"
  />
</template>
