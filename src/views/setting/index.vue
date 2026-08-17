<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { i18n, setLocale } from '@/locales';
import { LANG_OPTIONS } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useTheme } from '@/hooks/common/use-theme';
import { enableClickFx, disableClickFx } from '@/plugins/click-fx';
import { cn } from '@/utils/common';

defineOptions({ name: 'SettingView' });

const { darkMode, toggleDarkMode } = useTheme();
const appStore = useAppStore();
const currentLocale = computed(() => i18n.global.locale.value);

function handleSwitchLang(value: App.I18n.LangType) {
  setLocale(value);
}

/** 切换鼠标样式：动画样式启用 ba-click-fx 特效，默认样式关闭并恢复系统光标 */
function handleSwitchMouseStyle(style: 'default' | 'animated') {
  appStore.setMouseStyle(style);
  if (style === 'animated') {
    enableClickFx();
  } else {
    disableClickFx();
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[140rem] px-4 py-8 sm:px-6 sm:py-10">
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

      <!-- 鼠标样式设置 -->
      <section class="card bg-base-200">
        <div class="card-body">
          <h2 class="card-title text-base">{{ $t('setting.mouseStyle') }}</h2>
          <div class="mt-2 flex flex-wrap gap-3">
            <button
              class="mouse-style-item"
              :class="cn(appStore.mouseStyle === 'default' && 'active')"
              @click="handleSwitchMouseStyle('default')"
            >
              <Icon icon="heroicons:cursor-arrow-rays" class="mouse-style-icon" />
              <div class="mouse-style-info">
                <p class="mouse-style-name">{{ $t('setting.mouseStyleDefault') }}</p>
                <p class="mouse-style-desc">{{ $t('setting.mouseStyleDefaultDesc') }}</p>
              </div>
            </button>
            <button
              class="mouse-style-item"
              :class="cn(appStore.mouseStyle === 'animated' && 'active')"
              @click="handleSwitchMouseStyle('animated')"
            >
              <Icon icon="heroicons:sparkles" class="mouse-style-icon" />
              <div class="mouse-style-info">
                <p class="mouse-style-name">{{ $t('setting.mouseStyleAnimated') }}</p>
                <p class="mouse-style-desc">{{ $t('setting.mouseStyleAnimatedDesc') }}</p>
              </div>
            </button>
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

<style scoped lang="scss">
/* 鼠标样式选项卡片 */
.mouse-style-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 220px;
  flex: 1;
  padding: 12px 14px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 10%, transparent);
  border-radius: 12px;
  background: color-mix(in oklab, var(--color-base-content) 3%, transparent);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background: color-mix(in oklab, var(--color-base-content) 6%, transparent);
  }

  &.active {
    border-color: rgba(102, 126, 234, 0.45);
    background: rgba(102, 126, 234, 0.12);

    .mouse-style-name {
      color: #667eea;
      font-weight: 700;
    }
  }

  .mouse-style-icon {
    font-size: 22px;
    color: #667eea;
    flex-shrink: 0;
  }

  .mouse-style-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .mouse-style-name {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 90%, transparent);
  }

  .mouse-style-desc {
    font-size: 12px;
    color: color-mix(in oklab, var(--color-base-content) 55%, transparent);
  }
}
</style>
