<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({ name: 'HomeView' });

/** 核心功能卡片（icon 对应 plugins/icons.ts 中注册的图标） */
const features = [
  { icon: 'heroicons:server-stack', titleKey: 'home.feature.query.title', descKey: 'home.feature.query.desc' },
  { icon: 'heroicons:building-library', titleKey: 'home.feature.community.title', descKey: 'home.feature.community.desc' },
  { icon: 'heroicons:cursor-arrow-rays', titleKey: 'home.feature.join.title', descKey: 'home.feature.join.desc' },
  { icon: 'heroicons:clock', titleKey: 'home.feature.autoJoin.title', descKey: 'home.feature.autoJoin.desc' },
  { icon: 'heroicons:clipboard-document', titleKey: 'home.feature.copy.title', descKey: 'home.feature.copy.desc' },
  { icon: 'heroicons:arrow-path', titleKey: 'home.feature.refresh.title', descKey: 'home.feature.refresh.desc' },
  { icon: 'heroicons:key', titleKey: 'home.feature.auth.title', descKey: 'home.feature.auth.desc' },
  { icon: 'heroicons:chart-bar', titleKey: 'home.feature.stats.title', descKey: 'home.feature.stats.desc' }
];

/** 项目技术栈（专有名词，无需翻译） */
const techStack = [
  'Electron',
  'Vue 3',
  'TypeScript',
  'Vite',
  'Naive UI',
  'Pinia',
  'Vue Router',
  'UnoCSS',
  'Axios',
  'dayjs',
  'vue-i18n',
  'electron-builder'
];

/** 下载平台（icon 对应 plugins/icons.ts 中注册的图标；available 为 false 的平台暂未开放下载） */
const downloadPlatforms = [
  { key: 'windows', icon: 'mdi:windows', titleKey: 'home.download.windows', available: true, url: 'https://www.bluearchive.top/statics/soft/蔚蓝档案登录器-Windows-Setup.exe' },
  { key: 'linux', icon: 'mdi:linux', titleKey: 'home.download.linux', available: false, url: '' },
  { key: 'mac', icon: 'mdi:apple', titleKey: 'home.download.mac', available: false, url: '' }
];

/** 平滑滚动到核心功能区 */
function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <div class="mx-auto w-full max-w-[140rem] px-4 py-8 sm:px-6 sm:py-10">
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/10"
    >
      <!-- 装饰：halo 光环 + 光斑 -->
      <svg
        class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-40"
        viewBox="0 0 48 48"
        fill="none"
      >
        <ellipse cx="38" cy="12" rx="16" ry="6.5" stroke="#fff" stroke-opacity="0.6" stroke-width="2" transform="rotate(28 38 12)" />
        <ellipse cx="38" cy="12" rx="8" ry="3.2" stroke="#fff" stroke-opacity="0.4" stroke-width="2" transform="rotate(28 38 12)" />
      </svg>
      <div class="pointer-events-none absolute -bottom-16 -left-12 h-60 w-60 rounded-full bg-white/10 blur-3xl"></div>

      <div class="relative px-6 py-16 text-center sm:px-12 sm:py-20">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium backdrop-blur"
        >
          <Icon icon="heroicons:bolt" class="h-3.5 w-3.5" />
          {{ $t('home.badge') }}
        </span>

        <h1 class="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">{{ $t('home.title') }}</h1>
        <p class="mx-auto mt-4 max-w-2xl text-white/85 sm:text-lg">{{ $t('home.description') }}</p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="btn btn-lg btn-primary border-0 shadow-lg shadow-blue-900/20"
            @click="scrollToFeatures"
          >
            {{ $t('home.learnMore') }}
            <Icon icon="heroicons:arrow-right" class="h-5 w-5" />
          </button>
          <router-link to="/server" class="btn btn-lg btn-ghost text-white hover:bg-white/10">
            {{ $t('home.goServer') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- 下载区 -->
    <section class="mt-16">
      <div class="text-center">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">{{ $t('home.section.downloadTitle') }}</h2>
        <p class="mt-2 text-sm text-base-content/60 sm:text-base">{{ $t('home.section.downloadDesc') }}</p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="platform in downloadPlatforms"
          :key="platform.key"
          class="card bg-base-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5"
        >
          <div class="card-body items-center py-8 text-center">
            <Icon :icon="platform.icon" class="h-10 w-10 text-base-content/80" />
            <h3 class="mt-3 text-lg font-bold">{{ $t(platform.titleKey) }}</h3>
            <p class="text-sm text-base-content/50">{{ $t('home.download.latest') }}</p>
            <a v-if="platform.available" :href="platform.url" class="btn btn-primary btn-block mt-4">
              {{ $t('home.download.action') }}
            </a>
            <button v-else disabled class="btn btn-block mt-4">
              {{ $t('home.download.unavailable') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section id="features" class="mt-16 scroll-mt-24">
      <div class="text-center">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">{{ $t('home.section.featuresTitle') }}</h2>
        <p class="mt-2 text-sm text-base-content/60 sm:text-base">{{ $t('home.section.featuresDesc') }}</p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in features"
          :key="item.titleKey"
          class="card bg-base-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5"
        >
          <div class="card-body">
            <span class="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon :icon="item.icon" class="h-6 w-6" />
            </span>
            <h3 class="mt-2 text-base font-bold">{{ $t(item.titleKey) }}</h3>
            <p class="text-sm leading-relaxed text-base-content/60">{{ $t(item.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="mt-16">
      <div class="text-center">
        <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">{{ $t('home.section.techTitle') }}</h2>
        <p class="mt-2 text-sm text-base-content/60 sm:text-base">{{ $t('home.section.techDesc') }}</p>
      </div>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <span
          v-for="name in techStack"
          :key="name"
          class="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-4 py-2 text-sm font-medium text-base-content/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Icon icon="heroicons:code-bracket" class="h-4 w-4 opacity-60" />
          {{ name }}
        </span>
      </div>
    </section>
  </div>
</template>
