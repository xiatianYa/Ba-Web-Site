<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import {
  getMapPhaseText,
  formatMapRuntimeZh,
  getPlayerLevel,
  getScoreLevel,
  getTypeColorHex,
  PLAYER_LEVEL_COLORS,
  SCORE_COLORS
} from '@/hooks/business/server';
import { useDict } from '@/hooks/business/use-dict';

defineOptions({ name: 'ServerCardList' });

const { t } = useI18n();
const { dictOptions, dictLabel, dictType } = useDict();

const props = defineProps<{ servers: Api.Game.SeverVo[] }>();

const emit = defineEmits<{
  (e: 'join', server: Api.Game.SeverVo): void;
  (e: 'copy', server: Api.Game.SeverVo): void;
  (e: 'autoJoin', server: Api.Game.SeverVo): void;
}>();

/** 展示列表：在线服务器在前、离线置底（组内保持原有顺序） */
const displayServers = computed(() => {
  const online = props.servers.filter(s => s.isOnline);
  const offline = props.servers.filter(s => !s.isOnline);
  return [...online, ...offline];
});

/** 服务器模式文案（字典 game_server_mode 渲染，未配置模式归入「未分组」） */
const getServerModeLabel = (mode: number | null): string => {
  if (mode === null) return t('server.unknownMode');
  const label = dictLabel('game_server_mode', String(mode));
  if (label) return label;
  const fallbackKey = `server.mode${mode}`;
  return t(fallbackKey) === fallbackKey ? t('server.modeFallback', { mode }) : t(fallbackKey);
};

/** 按服务器模式分区（字典顺序排列，未知模式置底；组内保持在线优先、离线置底） */
const groups = computed<{ mode: number | null; label: string; servers: Api.Game.SeverVo[] }[]>(() => {
  const indexMap = new Map<string, number>();
  const result: { mode: number | null; label: string; servers: Api.Game.SeverVo[] }[] = [];

  displayServers.value.forEach(server => {
    const mode = server.mode ?? null;
    const key = mode === null ? '__none__' : String(mode);
    let gi = indexMap.get(key);
    if (gi === undefined) {
      gi = result.length;
      indexMap.set(key, gi);
      result.push({ mode, label: getServerModeLabel(mode), servers: [] });
    }
    result[gi].servers.push(server);
  });

  // 按 game_server_mode 字典顺序（value → 字典索引），未知模式置底
  const dictOrder = new Map(dictOptions('game_server_mode').map((d, i) => [d.value, i] as [string, number]));
  result.sort((a, b) => {
    const ai = a.mode === null ? Number.MAX_SAFE_INTEGER : (dictOrder.get(String(a.mode)) ?? Number.MAX_SAFE_INTEGER - 1);
    const bi = b.mode === null ? Number.MAX_SAFE_INTEGER : (dictOrder.get(String(b.mode)) ?? Number.MAX_SAFE_INTEGER - 1);
    return ai - bi;
  });

  return result;
});

/** 地图难度文案（game_type 字典，未配置时返回原值） */
const getTypeLabel = (type: string): string => {
  const item = dictOptions('game_type').find(i => i.value === type);
  return item?.label || type;
};

/** 地图难度标签主色（game_type 字典 type 字段 → 颜色） */
const getTypeColor = (type: string): string => {
  return getTypeColorHex(dictType('game_type', type));
};

/** 地图标签文案（game_tag 字典，未配置时返回原值） */
const getTagLabel = (tag: string): string => {
  const item = dictOptions('game_tag').find(i => i.value === tag);
  return item?.label || tag;
};

/** 在线人数方格：1 名玩家 = 1 个方格 */
const getDotTotal = (server: Api.Game.SeverVo) => server.maxPlayers || 1;
const getDotFilled = (server: Api.Game.SeverVo) =>
  Math.min(server.numPlayers || 0, getDotTotal(server));
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-for="(group, gi) in groups" :key="gi">
      <!-- 模式分区标题 -->
      <div class="mode-section-header">
        <span class="mode-section-label">{{ group.label }}</span>
        <span class="mode-count">{{ $t('server.serverCount', { count: group.servers.length }) }}</span>
      </div>
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-4">
    <div
      v-for="(server, index) in group.servers"
      :key="`${server.serverId}-${server.connectStr || index}`"
      class="sercer-card"
      :style="{ '--delay': `${Math.min(index * 0.03, 0.4)}s` }"
    >
      <!-- 在线卡片 -->
      <div v-if="server.isOnline" class="sercer-card-inner">
        <img v-if="server.mapUrl" :src="server.mapUrl" loading="lazy" class="server-card-bg" alt="" />
        <!-- 人数方格 -->
        <div class="server-dots" :style="{ '--level-color': PLAYER_LEVEL_COLORS[getPlayerLevel(server.numPlayers)] }">
          <span
            v-for="i in getDotTotal(server)"
            :key="i"
            class="server-dot"
            :class="{ filled: i <= getDotFilled(server) }"
          />
        </div>
        <div class="server-card-mask" />
        <!-- 内容 -->
        <div class="server-card-content">
          <div class="server-name">{{ server.serverName }}</div>
          <div class="row-map">
            <span class="map-name">{{ server.mapName }}</span>
            <span
              class="player-badge"
              :style="{ '--badge-color': PLAYER_LEVEL_COLORS[getPlayerLevel(server.numPlayers)] }"
            >
              <Icon icon="heroicons:user-group" class="player-icon" />
              <span class="player-num">
                {{ server.numPlayers }}<span class="player-sep">/</span>{{ server.maxPlayers }}
              </span>
            </span>
          </div>
          <div class="row-label">
            <Icon icon="heroicons:language" class="translate-icon" />
            <span class="map-label">{{ server.mapLabel || $t('server.noTranslation') }}</span>
            <span
              v-if="server.mapPhase"
              class="chip-score"
              :style="{ '--chip-color': SCORE_COLORS[getScoreLevel(server.CTScore, server.TScore)] }"
            >
              <span class="team-ct">{{ server.CTScore || '0' }}</span>
              <span class="score-phase">{{ getMapPhaseText(server.mapPhase) }}</span>
              <span class="team-t">{{ server.TScore || '0' }}</span>
            </span>
          </div>
          <div class="row-tags">
            <span
              v-if="server.type"
              class="tag tag-type"
              :style="{ '--tag-color': getTypeColor(server.type) }"
            >
              {{ getTypeLabel(server.type) }}
            </span>
            <span v-for="(tag, idx) in server.tag" :key="idx" class="tag tag-item">{{ getTagLabel(tag) }}</span>
            <span v-if="server.dateTimeOriginal" class="online-time" :title="$t('server.mapRuntime')">
              <Icon icon="heroicons:clock" class="online-time-icon" />
              {{ formatMapRuntimeZh(server.dateTimeOriginal) }}
            </span>
          </div>
        </div>
        <!-- 操作栏（hover 滑入） -->
        <div class="server-card-button">
          <button class="action-btn btn-join" :title="$t('server.joinServer')" @click="emit('join', server)">
            <Icon icon="heroicons:play" class="action-icon" />
          </button>
          <button class="action-btn btn-copy" :title="$t('server.copyAddr')" @click="emit('copy', server)">
            <Icon icon="heroicons:clipboard-document" class="action-icon" />
          </button>
          <button class="action-btn btn-auto" :title="$t('server.autoJoin')" @click="emit('autoJoin', server)">
            <Icon icon="heroicons:rocket-launch" class="action-icon" />
          </button>
        </div>
      </div>

      <!-- 离线卡片 -->
      <div v-else class="sercer-card-inner offline-card">
        <div class="server-offline" />
        <div class="offline-row-1">
          <Icon icon="heroicons:cloud" class="offline-cloud" />
          <span class="offline-name">{{ server.serverName || server.connectStr }}</span>
        </div>
        <div class="offline-row-2">
          <Icon icon="heroicons:server-stack" class="offline-server-icon" />
          <span>{{ $t('server.offline') }}</span>
        </div>
        <div class="offline-row-3">{{ $t('server.waiting') }}</div>
      </div>
    </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
/* 模式分区标题（占满整行，样式与启动器 mode-section-header 一致） */
.mode-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: color-mix(in oklab, var(--color-base-content) 70%, transparent);

  .mode-section-label {
    display: inline-flex;
    align-items: center;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      margin-right: 8px;
      border-radius: 50%;
      background: #667eea;
      box-shadow: 0 0 6px rgba(102, 126, 234, 0.6);
    }
  }

  .mode-count {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
    background: color-mix(in oklab, var(--color-base-content) 6%, transparent);
  }
}

/* 卡片：背景图 + 底部渐变遮罩 + 白色内容，与桌面端启动器风格一致 */
.sercer-card {
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

.sercer-card-inner {
  position: relative;
  height: 155px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background-color: #a5aaa3;
  transition: box-shadow 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.1);

    .server-card-bg {
      filter: brightness(1);
    }

    .server-card-mask {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.5) 100%);
    }

    .server-card-button {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }
}

.server-card-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transition: filter 0.3s ease;
  filter: brightness(0.9);
}

/* 人数方格条 */
.server-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 2px;
  z-index: 10;
  overflow: hidden;

  .server-dot {
    flex: 1 1 0;
    min-width: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.35);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);

    &.filled {
      background: var(--level-color);
      box-shadow: 0 0 4px color-mix(in oklab, var(--level-color) 60%, transparent);
    }
  }
}

.server-card-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 0;
  transition: background 0.25s ease;
}

/* 内容区（在遮罩之上） */
.server-card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 10px 8px;
  color: #fff;
  font-weight: 700;

  .server-name {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-map {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 6px;

    .map-name {
      font-size: 13px;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .row-label {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 13px;
    min-width: 0;

    .translate-icon {
      font-size: 18px;
      margin-right: 5px;
      flex-shrink: 0;
    }

    .map-label {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .row-tags {
    display: flex;
    align-items: center;
    margin-top: 6px;

    .tag {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 8px;
      margin-right: 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;

      &.tag-type {
        background: color-mix(in oklab, var(--tag-color, #667eea) 25%, transparent);
        color: color-mix(in oklab, var(--tag-color, #667eea) 55%, #fff);
        border: 1px solid color-mix(in oklab, var(--tag-color, #667eea) 35%, transparent);
      }

      &.tag-item {
        background: color-mix(in oklab, #22c55e 18%, transparent);
        color: #bbf7d0;
        border: 1px solid rgba(34, 197, 94, 0.3);
      }
    }

    .online-time {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-left: auto;
      flex-shrink: 0;
      height: 20px;
      padding: 0 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(102, 126, 234, 0.35);
      white-space: nowrap;
      transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

      .online-time-icon {
        font-size: 12px;
        color: #667eea;
      }

      &:hover {
        background: rgba(102, 126, 234, 0.22);
        border-color: rgba(102, 126, 234, 0.6);
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.25);
      }
    }
  }
}

/* 玩家徽标（发光边框随人数等级） */
.player-badge {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid color-mix(in oklab, var(--badge-color) 45%, transparent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 10px color-mix(in oklab, var(--badge-color) 20%, transparent);

  .player-icon {
    font-size: 13px;
    color: var(--badge-color);
    opacity: 0.9;
  }

  .player-num {
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
  }

  .player-sep {
    margin: 0 2px;
    opacity: 0.45;
    font-weight: 400;
  }
}

/* 比分胶囊（CT 领先蓝 / T 领先金 / 平局中性） */
.chip-score {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid color-mix(in oklab, var(--chip-color) 45%, transparent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 10px color-mix(in oklab, var(--chip-color) 20%, transparent);
  white-space: nowrap;

  .team-ct {
    color: #60a5fa;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 4px;
      border-radius: 50%;
      background: #60a5fa;
      box-shadow: 0 0 4px rgba(96, 165, 250, 0.6);
    }
  }

  .team-t {
    color: #fbbf24;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 4px;
      border-radius: 50%;
      background: #fbbf24;
      box-shadow: 0 0 4px rgba(251, 191, 36, 0.6);
    }
  }

  .score-phase {
    font-size: 11px;
    opacity: 0.7;
    font-weight: 500;
    white-space: nowrap;
  }
}

/* 操作栏（hover 从底部滑入） */
.server-card-button {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
  color: #fff;
  z-index: 2;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    color: #fff;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

    .action-icon {
      font-size: 22px;
    }

    &:active {
      transform: scale(0.92);
    }

    &.btn-join {
      color: rgba(34, 197, 94, 0.9);

      &:hover {
        background: rgba(34, 197, 94, 0.25);
        color: #22c55e;
      }
    }

    &.btn-copy {
      color: rgba(59, 130, 246, 0.9);

      &:hover {
        background: rgba(59, 130, 246, 0.25);
        color: #3b82f6;
      }
    }

    &.btn-auto {
      color: rgba(249, 115, 22, 0.9);

      &:hover {
        background: rgba(249, 115, 22, 0.25);
        color: #f97316;
      }
    }
  }
}

/* 离线卡片 */
.offline-card {
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%);
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  color: #fff;
  font-weight: 700;

  .server-offline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%);
  }

  .offline-row-1 {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 13px;

    .offline-cloud {
      font-size: 18px;
      margin-right: 5px;
      color: #facc15;
      flex-shrink: 0;
    }

    .offline-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .offline-row-2 {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 13px;
    color: #9ca3af;

    .offline-server-icon {
      font-size: 16px;
      margin-right: 5px;
      flex-shrink: 0;
    }
  }

  .offline-row-3 {
    margin-top: 6px;
    font-size: 13px;
    color: #a0a0a0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
