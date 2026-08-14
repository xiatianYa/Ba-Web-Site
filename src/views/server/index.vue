<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/store/modules/game';
import ServerWebsocket from '@/utils/ws/server';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';
import ServerCardList from './modules/server-card-list.vue';
import ServerTableList from './modules/server-table-list.vue';
import CommunityList from './modules/community-list.vue';
import GameJoinDialog from './modules/game-join-dialog.vue';

defineOptions({ name: 'ServerView' });

const { t } = useI18n();
const gameStore = useGameStore();
const { filteredServerList, communityList, wsStatus, selectedCommunityId } = storeToRefs(gameStore);

/** 视图模式（持久化到本地存储） */
const viewMode = ref<'card' | 'table'>(localStg.get(APP_STORAGE_KEYS.SERVER_VIEW) === 'table' ? 'table' : 'card');

/** 复制成功提示 */
const toastMsg = ref('');
let toastTimer: ReturnType<typeof setTimeout> | null = null;

/** 连接状态展示文案与图标 */
const wsStatusText = computed(() => {
  const map: Record<string, string> = {
    connecting: t('server.wsConnecting'),
    open: t('server.wsConnected'),
    closed: t('server.wsDisconnected')
  };
  return map[wsStatus.value] || t('server.wsDisconnected');
});

/** 显示临时提示 */
function showToast(msg: string) {
  toastMsg.value = msg;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMsg.value = ''), 2000);
}

/** 复制文本到剪贴板 */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t('server.copySuccess'));
  } catch {
    /* 剪贴板不可用时静默失败 */
  }
}

/** 加入服务器（Web 端复制 connect 指令） */
function joinServer(server: Api.Game.SeverVo) {
  copyText(`connect ${server.connectStr}`);
}

/** 复制服务器地址 */
function copyServerAddr(server: Api.Game.SeverVo) {
  copyText(server.connectStr);
}

/** 挤服窗口显隐与目标服务器 */
const joinDialogVisible = ref(false);
const joinDialogServer = ref<Api.Game.SeverVo | null>(null);

/** 打开挤服窗口（展示服务器信息 + 配置触发人数/延迟） */
function openJoinDialog(server: Api.Game.SeverVo) {
  joinDialogServer.value = server;
  joinDialogVisible.value = true;
}

/** 开始挤服：Web 端无法直接启动游戏，复制 steam 协议链接（可唤起本机 CS2） */
function handleStartJoin(server: Api.Game.SeverVo) {
  copyText(`steam://connect/${server.connectStr}`);
  showToast(t('server.joinDialog.copyTip'));
  joinDialogVisible.value = false;
}

/** 切换视图模式并持久化 */
function switchView(mode: 'card' | 'table') {
  viewMode.value = mode;
  localStg.set(APP_STORAGE_KEYS.SERVER_VIEW, mode);
}

/** 重新建立 WS 连接 */
function reconnectWs() {
  if (wsStatus.value !== 'open') {
    ServerWebsocket.init();
  }
}

/** 切换社区分类 */
function handleSelectCommunity(id: number | null) {
  gameStore.selectCommunity(id);
}

onMounted(() => {
  // 并行初始化：拉取社区列表 + 建立 WS 连接
  gameStore.fetchCommunityList();
  ServerWebsocket.init();
});

onUnmounted(() => {
  ServerWebsocket.close();
  if (toastTimer) clearTimeout(toastTimer);
});
</script>

<template>
  <div class="mx-auto w-full max-w-[140rem] px-4 py-8 sm:px-6 sm:py-10">
    <!-- 两栏布局：主区（列表）+ 右侧社区栏（桌面） -->
    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- 主区 -->
      <div class="min-w-0 flex-1">
        <div class="mb-1 flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <Icon icon="heroicons:server-stack" class="h-4 w-4 text-indigo-500" />
            <h1 class="text-base font-bold tracking-tight">{{ $t('server.title') }}</h1>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <!-- 连接状态（点击重连） -->
            <button class="conn-btn" :class="wsStatus" :title="$t('server.reconnect')" @click="reconnectWs">
              <span class="status-dot"
                :class="wsStatus === 'open' ? 'online' : wsStatus === 'connecting' ? 'connecting' : 'offline'" />
              {{ wsStatusText }}
            </button>

            <!-- 视图切换（参考 updateLog view-switcher 风格） -->
            <div class="view-switcher">
              <button class="switch-btn" :class="{ active: viewMode === 'card' }" :title="$t('server.viewCards')"
                @click="switchView('card')">
                <Icon icon="heroicons:building-library" class="switch-icon" />
                <span>{{ $t('server.viewCards') }}</span>
              </button>
              <button class="switch-btn" :class="{ active: viewMode === 'table' }" :title="$t('server.viewTable')"
                @click="switchView('table')">
                <Icon icon="heroicons:bars-3" class="switch-icon" />
                <span>{{ $t('server.viewTable') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 空态 -->
        <div v-if="filteredServerList.length === 0" class="card bg-base-200">
          <div class="card-body items-center py-16 text-center">
            <Icon icon="heroicons:server-stack" class="h-12 w-12 opacity-40" />
            <p class="mt-3 text-base-content/70">{{ $t('server.empty') }}</p>
          </div>
        </div>

        <!-- 卡片视图 -->
        <ServerCardList v-else-if="viewMode === 'card'" :servers="filteredServerList" @join="joinServer"
          @copy="copyServerAddr" @auto-join="openJoinDialog" />

        <!-- 表格视图 -->
        <ServerTableList v-else :servers="filteredServerList" @join="joinServer" @copy="copyServerAddr"
          @auto-join="openJoinDialog" />
      </div>

      <!-- 右侧社区分类栏 -->
      <CommunityList :selected-id="selectedCommunityId" @select="handleSelectCommunity" />
    </div>

    <!-- 挤服窗口 -->
    <GameJoinDialog v-model:visible="joinDialogVisible" :server="joinDialogServer" @start-join="handleStartJoin" />

    <!-- 复制成功提示 -->
    <div v-if="toastMsg" class="toast toast-center toast-middle z-50">
      <div class="alert alert-success gap-2 py-2 shadow-xl">
        <Icon icon="heroicons:check" class="h-5 w-5" />
        <span class="text-sm">{{ toastMsg }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;

  &.online {
    background: #52c41a;
    color: #52c41a;
  }

  &.offline {
    background: #9ca3af;
    color: #9ca3af;
  }

  &.connecting {
    background: #f59e0b;
    color: #f59e0b;
    animation: pulse 1s ease-in-out infinite;
  }
}

/* 连接状态按钮（胶囊，状态色随 wsStatus） */
.conn-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  border-radius: 10px;
  background: color-mix(in oklab, var(--color-base-content) 4%, transparent);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 500;
  color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
  transition: all 0.25s ease;

  &:hover {
    background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
  }

  &.open {
    color: #22c55e;
  }

  &.closed {
    color: #ef4444;
  }

  &.connecting {
    color: #f59e0b;
  }
}

/* 视图切换（参考 updateLog view-switcher 风格） */
.view-switcher {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: 10px;
  background: color-mix(in oklab, var(--color-base-content) 4%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-base-content) 7%, transparent);

  .switch-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 500;
    color: color-mix(in oklab, var(--color-base-content) 55%, transparent);
    background: transparent;
    transition: all 0.25s ease;

    .switch-icon {
      font-size: 15px;
    }

    &:hover {
      color: color-mix(in oklab, var(--color-base-content) 85%, transparent);
    }

    &.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.15);
    }
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
