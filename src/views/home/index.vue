<script setup lang="ts">
import { ref } from 'vue';
import { getHomeData } from '@/service/api';
import { isSuccessResult } from '@/service/request';

defineOptions({ name: 'HomeView' });

const loading = ref(false);
const notice = ref('');

/** 示例：调用封装好的 axios 接口，验证请求链路 */
async function handleFetch() {
  loading.value = true;
  const res = await getHomeData();
  if (isSuccessResult(res)) {
    notice.value = res.data.notice;
  } else {
    notice.value = `请求失败：${res.error.message}`;
  }
  loading.value = false;
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-14">
    <!-- Hero 区域 -->
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/10"
    >
      <!-- 装饰光斑 -->
      <div class="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl"></div>
      <div class="pointer-events-none absolute -bottom-16 -left-12 h-60 w-60 rounded-full bg-white/10 blur-3xl"></div>

      <div class="relative px-6 py-16 text-center sm:px-12 sm:py-20">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium backdrop-blur"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
          Vue 3 · TypeScript · Vite · Pinia · Axios · daisyUI
        </span>

        <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Ba-Web-Site</h1>
        <p class="mx-auto mt-4 max-w-xl text-white/85">
          碧蓝档案粉丝站工程骨架，页面内容待补充。点击下方按钮可验证封装好的接口请求链路。
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="btn btn-lg btn-primary border-0 shadow-lg shadow-blue-900/20"
            :disabled="loading"
            @click="handleFetch"
          >
            {{ loading ? '请求中…' : '测试接口请求' }}
          </button>
          <router-link to="/setting" class="btn btn-lg btn-ghost text-white hover:bg-white/10">
            前往设置
          </router-link>
        </div>

        <p v-if="notice" class="mt-5 inline-block rounded-full bg-black/20 px-4 py-1.5 text-sm">
          {{ notice }}
        </p>
      </div>
    </section>
  </div>
</template>
