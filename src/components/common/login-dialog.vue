<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/store/modules/auth';
import { getQqLoginUrl, getSteamLoginUrl, OAUTH_MESSAGE_SOURCE } from '@/hooks/business/oauth';

defineOptions({ name: 'LoginDialog' });

const authStore = useAuthStore();

/** 登录进行中（等待授权窗口回传结果） */
const loginLoading = ref(false);
/** 登录错误提示 */
const errorMsg = ref('');

/** 第三方登录入口（type 对应后端 OAuthType：0=QQ 1=Steam） */
const providers = [
  {
    type: 'qq' as const,
    icon: 'brand:qq',
    color: '#12b7f5',
    titleKey: 'login.provider.qq',
    descKey: 'login.provider.qqDesc'
  },
  {
    type: 'steam' as const,
    icon: 'brand:steam',
    color: '#66c0f4',
    titleKey: 'login.provider.steam',
    descKey: 'login.provider.steamDesc'
  }
];

/** 打开第三方授权弹窗；回调页处理完成后会通过 postMessage 回传结果 */
function handleLogin(type: 'qq' | 'steam') {
  errorMsg.value = '';
  loginLoading.value = true;

  const url = type === 'qq' ? getQqLoginUrl() : getSteamLoginUrl();
  console.debug('[LoginDialog] 打开授权弹窗', type, url);
  const features =
    type === 'qq'
      ? 'width=520,height=680,left=200,top=100,menubar=no,toolbar=no,location=no,status=no'
      : 'width=1000,height=820,left=200,top=100,menubar=no,toolbar=no,location=no,status=no';

  window.open(url, '_blank', features);
}

/** 接收授权窗口回传：success 携带 loginParams，error 携带 message */
function onMessage(e: MessageEvent) {
  console.debug('[LoginDialog] 收到 message 事件', { origin: e.origin, data: e.data });

  if (e.data?.source !== OAUTH_MESSAGE_SOURCE) return;
  // 开发环境(localhost)下弹窗回跳的是生产域名，origin 不同属正常，仅提示
  if (e.origin !== window.location.origin) {
    console.warn('[LoginDialog] 消息来自非同源窗口，已校验 source 标识，请确认数据可信:', e.origin);
  }

  if (e.data.type === 'success') {
    const params = e.data.loginParams as { accessToken?: string; openId?: string; type?: number };
    console.debug('[LoginDialog] 收到登录参数，调用后端 oAuthLogin', params);
    if (!params || !params.openId || typeof params.type !== 'number') {
      errorMsg.value = '授权回传参数无效，请重试';
      loginLoading.value = false;
      return;
    }
    void authStore
      .oAuthLogin(params as { accessToken: string; openId: string; type: Api.Auth.OAuthType })
      .catch(err => {
        errorMsg.value = (err as Error).message || '登录失败，请重试';
      })
      .finally(() => {
        loginLoading.value = false;
      });
  } else {
    errorMsg.value = e.data.message || '登录失败，请重试';
    loginLoading.value = false;
  }
}

/** Esc 关闭弹窗 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && authStore.loginModalVisible) {
    authStore.closeLoginModal();
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage);
  window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage);
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

/** 锁定/恢复页面滚动
 * 锁定滚动时垂直滚动条会消失、页面变宽，需用 padding-right 补偿滚动条宽度，避免元素横向跳动 */
function lockScroll(lock: boolean) {
  if (lock) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

/** 弹窗开合时锁定/恢复页面滚动，并在关闭时重置状态 */
watch(
  () => authStore.loginModalVisible,
  visible => {
    lockScroll(visible);
    if (!visible) {
      loginLoading.value = false;
      errorMsg.value = '';
    }
  }
);
</script>

<template>
  <Transition name="login">
    <div
      v-if="authStore.loginModalVisible"
      class="login-overlay"
      role="dialog"
      aria-modal="true"
      @click.self="authStore.closeLoginModal()"
    >
      <div class="login-card">
        <!-- 头部：品牌图标 + 标题 -->
        <header class="login-header">
          <span class="glow glow-a" />
          <span class="glow glow-b" />
          <button
            class="close-btn"
            :aria-label="$t('common.cancel')"
            @click="authStore.closeLoginModal()"
          >
            <Icon icon="heroicons:x-mark" class="h-5 w-5" />
          </button>
          <span class="brand-icon">
            <Icon icon="heroicons:bolt" class="h-6 w-6" />
          </span>
          <h3 class="title">{{ $t('login.title') }}</h3>
          <p class="desc">{{ $t('login.desc') }}</p>
        </header>

        <!-- 主体：错误提示 + 登录方式 -->
        <div class="login-body">
          <p v-if="errorMsg" class="error-box">
            <Icon icon="heroicons:information-circle" class="h-4 w-4 shrink-0" />
            <span>{{ errorMsg }}</span>
          </p>

          <p class="provider-label">{{ $t('login.providerLabel') }}</p>

          <div class="provider-list">
            <button
              v-for="p in providers"
              :key="p.type"
              class="provider-btn"
              :style="{ '--provider-color': p.color }"
              :disabled="loginLoading"
              @click="handleLogin(p.type)"
            >
              <span class="provider-icon">
                <Icon :icon="p.icon" class="h-6 w-6" />
              </span>
              <span class="provider-info">
                <span class="provider-name">{{ $t(p.titleKey) }}</span>
                <span class="provider-desc">{{ $t(p.descKey) }}</span>
              </span>
              <span class="provider-arrow">
                <Icon icon="heroicons:arrow-right" class="h-4 w-4" />
              </span>
            </button>
          </div>

          <p v-if="loginLoading" class="login-loading">
            <span class="loading loading-spinner loading-sm" />
            {{ $t('login.waiting') }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
/* ---------- 遮罩层 ---------- */
.login-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: color-mix(in oklab, var(--color-base-100) 42%, transparent);
  backdrop-filter: blur(6px);
}

.login-card {
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: var(--color-base-100);
  box-shadow: 0 24px 64px -16px rgba(2, 6, 23, 0.45);
}

/* ---------- 头部 ---------- */
.login-header {
  position: relative;
  padding: 30px 24px 28px;
  overflow: hidden;
  text-align: center;
  color: #fff;
  /* 深海蓝渐变：顶部一道柔和天光，无玻璃光斑，干净克制 */
  background:
    radial-gradient(110% 100% at 50% -20%, rgba(125, 211, 252, 0.22), transparent 55%),
    linear-gradient(150deg, #0d1b3e 0%, #173d8c 52%, #2a63d9 100%);

  /* 底部发光细线，收尾更精致 */
  &::after {
    content: '';
    position: absolute;
    right: 24px;
    bottom: 0;
    left: 24px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  }

  /* 柔和光斑：高透明度、低饱和，只做氛围不抢焦点 */
  .glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(12px);
    pointer-events: none;
  }
  .glow-a {
    top: -52px;
    right: -36px;
    width: 140px;
    height: 140px;
    background: rgba(125, 211, 252, 0.14);
  }
  .glow-b {
    bottom: -48px;
    left: -30px;
    width: 120px;
    height: 120px;
    background: rgba(196, 181, 253, 0.12);
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.26);
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.92);
    }
  }

  .brand-icon {
    display: grid;
    place-items: center;
    width: 50px;
    height: 50px;
    margin: 0 auto 14px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.24);
    background: rgba(255, 255, 255, 0.1);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      0 12px 28px -12px rgba(2, 6, 23, 0.6);
  }

  .title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .desc {
    margin: 6px 0 0;
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.72);
  }
}

/* ---------- 主体 ---------- */
.login-body {
  padding: 24px 24px 28px;
}

.error-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--color-error) 18%, transparent);
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-error);
  background: color-mix(in oklab, var(--color-error) 10%, transparent);
}

.provider-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--color-base-content) 42%, transparent);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: color-mix(in oklab, var(--color-base-content) 10%, transparent);
  }
}

.provider-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.provider-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: color-mix(in oklab, var(--color-base-content) 3%, transparent);
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: color-mix(in oklab, var(--provider-color) 42%, transparent);
    background: color-mix(in oklab, var(--provider-color) 7%, transparent);
    box-shadow: 0 10px 24px -14px color-mix(in oklab, var(--provider-color) 55%, transparent);

    .provider-arrow {
      opacity: 1;
      color: var(--provider-color);
      transform: translateX(3px);
    }
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.55;
    box-shadow: none;
  }

  .provider-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 12px;
    color: var(--provider-color);
    background: color-mix(in oklab, var(--provider-color) 11%, transparent);
  }

  .provider-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .provider-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-base-content);
  }
  .provider-desc {
    font-size: 12px;
    color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
  }

  .provider-arrow {
    display: grid;
    place-items: center;
    opacity: 0.35;
    color: var(--color-base-content);
    transition: opacity 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }
}

.login-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0 0;
  font-size: 12.5px;
  color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
}

/* ---------- 进出场动画 ---------- */
.login-enter-active {
  transition: opacity 0.25s ease;
}
.login-enter-active .login-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.login-leave-active {
  transition: opacity 0.2s ease;
}
.login-leave-active .login-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.login-enter-from {
  opacity: 0;
}
.login-enter-from .login-card {
  opacity: 0;
  transform: translateY(18px) scale(0.95);
}
.login-leave-to {
  opacity: 0;
}
.login-leave-to .login-card {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>
