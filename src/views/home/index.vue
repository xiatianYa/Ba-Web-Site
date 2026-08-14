<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { getHomeData } from '@/service/api';
import { isSuccessResult } from '@/service/request';

defineOptions({ name: 'HomeView' });

const { t } = useI18n();

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

const loading = ref(false);
const notice = ref('');

/** 示例：调用封装好的 axios 接口，验证请求链路 */
async function handleFetch() {
  loading.value = true;
  const res = await getHomeData();
  if (isSuccessResult(res)) {
    notice.value = res.data.notice;
  } else {
    notice.value = t('home.requestFailed', { message: res.error.message });
  }
  loading.value = false;
}

/** 平滑滚动到核心功能区 */
function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-14">
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

    <!-- 请求链路验证 -->
    <section class="mt-16">
      <div class="card bg-base-200">
        <div class="card-body items-center py-12 text-center sm:px-12">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon icon="heroicons:arrow-path" class="h-6 w-6" />
          </span>
          <h2 class="mt-4 text-xl font-extrabold tracking-tight">{{ $t('home.section.testTitle') }}</h2>
          <p class="mt-2 max-w-xl text-sm text-base-content/60 sm:text-base">{{ $t('home.section.testDesc') }}</p>

          <button
            class="btn btn-lg btn-primary mt-6"
            :disabled="loading"
            @click="handleFetch"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ loading ? $t('home.requesting') : $t('home.testRequest') }}
          </button>

          <p v-if="notice" class="mt-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            {{ notice }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA 区域 -->
    <section class="mt-16">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-500 p-8 text-center text-white shadow-xl shadow-blue-500/10 sm:p-12">
        <div class="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-14 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>

        <div class="relative">
          <Icon icon="heroicons:rocket-launch" class="mx-auto h-10 w-10 text-white/80" />
          <h2 class="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">{{ $t('home.section.ctaTitle') }}</h2>
          <p class="mx-auto mt-2 max-w-xl text-white/80">{{ $t('home.section.ctaDesc') }}</p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <router-link to="/server" class="btn btn-lg btn-primary border-0 shadow-lg shadow-blue-900/20">
              {{ $t('home.goServer') }}
            </router-link>
            <router-link to="/setting" class="btn btn-lg btn-ghost text-white hover:bg-white/10">
              {{ $t('home.goSetting') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
