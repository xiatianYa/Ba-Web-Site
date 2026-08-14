<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/store/modules/auth';
import IconButton from './icon-button.vue';

defineOptions({ name: 'UserMenu' });

const authStore = useAuthStore();

/** 用户昵称首字符（作为头像占位） */
const nicknameInitial = computed(() => authStore.userInfo?.nickName?.charAt(0) || 'U');

/** 退出登录 */
function handleLogout() {
  void authStore.logout();
}
</script>

<template>
  <!-- 未登录：登录入口 -->
  <IconButton
    v-if="!authStore.isLogin"
    icon="heroicons:user"
    :label="$t('login.title')"
    :title="$t('login.title')"
    @click="authStore.openLoginModal()"
  />

  <!-- 已登录：用户菜单 -->
  <div v-else class="dropdown dropdown-end">
    <IconButton
      tabindex="0"
      :label="$t('login.userMenu')"
      :title="authStore.userInfo?.nickName || authStore.userInfo?.userName"
    >
      <span
        class="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary"
      >
        {{ nicknameInitial }}
      </span>
    </IconButton>
    <ul
      tabindex="0"
      class="dropdown-content menu z-10 mt-2 w-48 gap-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
    >
      <li class="pointer-events-none">
        <span class="flex flex-col">
          <span class="text-sm font-semibold">{{ authStore.userInfo?.nickName || $t('login.notLoggedIn') }}</span>
          <span class="text-xs text-base-content/50">{{ authStore.userInfo?.userName }}</span>
        </span>
      </li>
      <li>
        <a class="text-error" @click="handleLogout">
          <Icon icon="heroicons:arrow-right-on-rectangle" class="h-4 w-4" />
          {{ $t('login.logout') }}
        </a>
      </li>
    </ul>
  </div>
</template>
