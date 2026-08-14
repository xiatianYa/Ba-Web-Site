<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { i18n, setLocale } from '@/locales';
import { LANG_OPTIONS } from '@/constants/app';
import { cn } from '@/utils/common';
import IconButton from './icon-button.vue';

defineOptions({ name: 'LangSwitch' });

/** 当前语言 */
const currentLocale = computed(() => i18n.global.locale.value);

/** 切换语言 */
function handleSwitchLang(value: App.I18n.LangType) {
  setLocale(value);
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <IconButton
      tabindex="0"
      icon="heroicons:language"
      :label="$t('nav.switchLanguage')"
      :title="$t('nav.switchLanguage')"
    />
    <ul
      tabindex="0"
      class="dropdown-content menu z-10 mt-2 w-44 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
    >
      <li v-for="opt in LANG_OPTIONS" :key="opt.value">
        <a
          :class="cn('justify-between gap-2', currentLocale === opt.value && 'menu-active')"
          @click="handleSwitchLang(opt.value)"
        >
          {{ $t(opt.labelKey) }}
          <Icon v-if="currentLocale === opt.value" icon="heroicons:check" class="h-4 w-4" />
        </a>
      </li>
    </ul>
  </div>
</template>
