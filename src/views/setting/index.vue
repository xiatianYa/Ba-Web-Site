<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { i18n, setLocale } from '@/locales';
import { LANG_OPTIONS } from '@/constants/app';
import { useTheme } from '@/hooks/common/use-theme';
import { cn } from '@/utils/common';

defineOptions({ name: 'SettingView' });

const { darkMode, toggleDarkMode } = useTheme();
const currentLocale = computed(() => i18n.global.locale.value);

function handleSwitchLang(value: App.I18n.LangType) {
  setLocale(value);
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-12">
    <h1 class="mb-6 text-3xl font-extrabold tracking-tight">{{ $t('setting.title') }}</h1>

    <div class="flex flex-col gap-6">
      <!-- 外观设置 -->
      <section class="card bg-base-200">
        <div class="card-body">
          <h2 class="card-title text-base">{{ $t('setting.appearance') }}</h2>
          <div class="mt-2 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Icon
                :icon="darkMode ? 'heroicons:moon' : 'heroicons:sun'"
                class="h-5 w-5 text-base-content/60"
              />
              <div>
                <p class="font-medium">{{ $t('setting.theme') }}</p>
                <p class="text-sm text-base-content/60">{{ $t('setting.themeDesc') }}</p>
              </div>
            </div>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              :checked="darkMode"
              :aria-label="$t('setting.theme')"
              @change="toggleDarkMode"
            />
          </div>
        </div>
      </section>

      <!-- 语言设置 -->
      <section class="card bg-base-200">
        <div class="card-body">
          <h2 class="card-title text-base">{{ $t('setting.language') }}</h2>
          <div class="mt-2 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Icon icon="heroicons:language" class="h-5 w-5 text-base-content/60" />
              <div>
                <p class="font-medium">{{ $t('setting.languageDesc') }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                v-for="opt in LANG_OPTIONS"
                :key="opt.value"
                class="btn btn-sm"
                :class="cn(currentLocale === opt.value && 'btn-primary')"
                @click="handleSwitchLang(opt.value)"
              >
                {{ $t(opt.labelKey) }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
