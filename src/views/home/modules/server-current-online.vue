<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/store/modules/game';
import { useAuthStore } from '@/store/modules/auth';
import ServerWebsocket from '@/utils/ws/server';

defineOptions({ name: 'ServerCurrentOnline' });

const gameStore = useGameStore();
const authStore = useAuthStore();

/** 展示列表上限：避免全量推送时渲染过多 DOM */
const DISPLAY_MAX = 12;

/** 在线服务器列表（按人数降序） */
const onlineServers = computed(() =>
  [...gameStore.serverList]
    .filter(s => s.isOnline)
    .sort((a, b) => (b.numPlayers || 0) - (a.numPlayers || 0))
);

/** 在线服务器总数 */
const onlineCount = computed(() => onlineServers.value.length);

/** 总在线人数 */
const totalPlayers = computed(() =>
  onlineServers.value.reduce((sum, s) => sum + (s.numPlayers || 0), 0)
);

/** 人数最多的服务器 */
const maxServer = computed(() => onlineServers.value[0] ?? null);

/** 展示列表 */
const displayServers = computed(() => onlineServers.value.slice(0, DISPLAY_MAX));

/** 是否为空 */
const isEmpty = computed(() => onlineServers.value.length === 0);

/** 首页进入时初始化实时数据（社区列表 + WS 推送） */
onMounted(() => {
  gameStore.fetchCommunityList();
  ServerWebsocket.init();
});

// 登录态变化时重建 WS 连接，切换鉴权端点 /ws/server/{token} 与公共端点 /ws/public/server
watch(
  () => authStore.isLogin,
  () => {
    ServerWebsocket.init();
  }
);
</script>

<template>
  <div class="dash-card server-online-card">
    <!-- 卡片头部 -->
    <div class="dash-head">
      <div class="dash-title">
        <span class="dash-title-icon"><Icon icon="heroicons:server-stack" class="h-4 w-4" /></span>
        <div class="flex flex-col leading-tight">
          <span>{{ $t('home.dash.currentOnline') }}</span>
          <span class="text-[11px] font-normal text-base-content/45">{{
            $t('home.dash.currentOnlineDesc')
          }}</span>
        </div>
      </div>
      <span class="dash-live">
        <span class="dot" />
        {{ gameStore.wsStatus === 'open' ? $t('server.wsConnected') : $t('server.wsDisconnected') }}
      </span>
    </div>

    <!-- 空状态 -->
    <div v-if="isEmpty" class="dash-empty">
      <Icon icon="heroicons:server-stack" class="dash-empty-icon h-12 w-12" />
      <p>{{ $t('home.dash.waitingWs') }}</p>
    </div>

    <template v-else>
      <!-- 统计概览 -->
      <div class="grid grid-cols-2 gap-3">
        <div class="stat-tile">
          <Icon icon="heroicons:server-stack" class="h-4 w-4 text-sky-500" />
          <div class="stat-tile-info">
            <span class="stat-tile-label">{{ $t('home.dash.serversOnline') }}</span>
            <span class="stat-tile-value">{{ onlineCount }}</span>
          </div>
        </div>
        <div class="stat-tile">
          <Icon icon="heroicons:user-group" class="h-4 w-4 text-indigo-500" />
          <div class="stat-tile-info">
            <span class="stat-tile-label">{{ $t('home.dash.playersOnline') }}</span>
            <span class="stat-tile-value">{{ totalPlayers }}</span>
          </div>
        </div>
      </div>

      <!-- 最多人在线 -->
      <div v-if="maxServer" class="max-server">
        <div class="max-server-label">
          <Icon icon="heroicons:bolt" class="h-4 w-4 text-amber-500" />
          <span>{{ $t('home.dash.mostOnline') }}</span>
        </div>
        <div class="max-server-info">
          <span class="max-server-name" :title="maxServer.serverName">{{ maxServer.serverName }}</span>
          <span class="max-server-map">{{ maxServer.mapLabel || maxServer.mapName }}</span>
        </div>
        <div class="max-server-count">
          {{ maxServer.numPlayers }}<span>/{{ maxServer.maxPlayers }}</span>
        </div>
      </div>

      <!-- 服务器列表 -->
      <div class="server-list">
        <div v-for="server in displayServers" :key="server.serverId" class="server-item">
          <div class="server-item-left">
            <span class="server-name" :title="server.serverName">{{ server.serverName }}</span>
            <span class="server-map">{{ server.mapLabel || server.mapName }}</span>
          </div>
          <div
            class="server-players"
            :class="{ hot: (server.numPlayers || 0) >= (server.maxPlayers || 1) * 0.9 }"
          >
            <span class="num">{{ server.numPlayers }}</span>
            <span class="max">/{{ server.maxPlayers }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.server-online-card {
  min-height: 320px;
  max-height: 560px;
}

.stat-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--color-base-100) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--color-base-content) 7%, transparent);

  .stat-tile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .stat-tile-label {
    font-size: 11px;
    color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
  }

  .stat-tile-value {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.1;
    color: color-mix(in oklab, var(--color-base-content) 90%, transparent);
    font-variant-numeric: tabular-nums;
  }
}

.max-server {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(0, 150, 255, 0.04));
  border: 1px solid rgba(56, 189, 248, 0.22);

  .max-server-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;

    span {
      font-size: 9.5px;
      color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
    }
  }

  .max-server-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .max-server-name {
      font-size: 13px;
      font-weight: 600;
      color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .max-server-map {
      font-size: 11px;
      color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .max-server-count {
    font-size: 16px;
    font-weight: 800;
    color: #0ea5e9;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;

    span {
      font-size: 11px;
      font-weight: 500;
      color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
    }
  }
}

.server-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: color-mix(in oklab, var(--color-base-content) 14%, transparent);
  }

  .server-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    background: color-mix(in oklab, var(--color-base-100) 55%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-base-content) 6%, transparent);
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in oklab, var(--color-base-100) 85%, transparent);
      border-color: color-mix(in oklab, var(--color-primary) 25%, transparent);
    }

    .server-item-left {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;

      .server-name {
        font-size: 12.5px;
        font-weight: 600;
        color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .server-map {
        font-size: 10.5px;
        color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .server-players {
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;

      .num {
        font-size: 13px;
        font-weight: 700;
        color: #22c55e;
      }

      .max {
        font-size: 10.5px;
        color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
      }

      &.hot .num {
        color: #f0a020;
      }
    }
  }
}
</style>
