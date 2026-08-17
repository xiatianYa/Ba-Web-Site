<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import {
  getMapPhaseText,
  formatMapRuntimeCn,
  getPlayerColor,
  getScoreLevel,
  getTypeColorHex,
  compareServerSort
} from '@/hooks/business/server';
import { useDict } from '@/hooks/business/use-dict';

defineOptions({ name: 'ServerTableList' });

const { t } = useI18n();
const { dictOptions, dictLabel, dictType } = useDict();

const props = defineProps<{ servers: Api.Game.SeverVo[] }>();

const emit = defineEmits<{
  (e: 'join', server: Api.Game.SeverVo): void;
  (e: 'copy', server: Api.Game.SeverVo): void;
  (e: 'autoJoin', server: Api.Game.SeverVo): void;
}>();

// 排序状态：none 默认 / asc 正序 / desc 倒序
type SortOrder = 'none' | 'asc' | 'desc';
type SortField = 'players' | null;

const sortField = ref<SortField>(null);
const sortOrder = ref<SortOrder>('none');

/** 在线服务器数 */
const isServerOffline = (server: Api.Game.SeverVo) => !server.isOnline;

/** 获取玩家数进度百分比 */
const getPlayerPercent = (server: Api.Game.SeverVo) => {
  if (!server.maxPlayers) return 0;
  return Math.min((server.numPlayers / server.maxPlayers) * 100, 100);
};

/** 比分胶囊主色：CT 领先 → 蓝，T 领先 → 金，平局 → 中性 */
const getScoreChipColor = (server: Api.Game.SeverVo): string => {
  const level = getScoreLevel(server.CTScore, server.TScore);
  return level === 'ct' ? '#60a5fa' : level === 't' ? '#fbbf24' : '#e5e7eb';
};

/** 排序后的服务器列表：在线在前、离线置底；未点击表头排序时按编号(#N)优先升序，无编号按 sort 升序 */
const sortedServers = computed(() => {
  const sortFn =
    sortField.value === null || sortOrder.value === 'none'
      ? null
      : (a: Api.Game.SeverVo, b: Api.Game.SeverVo) => {
          let v1 = 0;
          let v2 = 0;

          if (sortField.value === 'players') {
            v1 = a.numPlayers ?? 0;
            v2 = b.numPlayers ?? 0;
          }

          return sortOrder.value === 'asc' ? v1 - v2 : v2 - v1;
        };

  // 默认排序：编号(#N)优先升序；无编号按 sort 升序（0 最前，null 置底）
  const bySort = compareServerSort;

  const online = props.servers.filter(s => !isServerOffline(s));
  const offline = props.servers.filter(isServerOffline);

  online.sort(sortFn ?? bySort);
  offline.sort(sortFn ?? bySort);

  return [...online, ...offline];
});

/** 切换排序状态：none -> asc -> desc -> none */
const toggleSort = (field: SortField) => {
  if (sortField.value !== field) {
    sortField.value = field;
    sortOrder.value = 'asc';
    return;
  }

  if (sortOrder.value === 'none') {
    sortOrder.value = 'asc';
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'none';
  }
};

/** 获取指定字段的排序状态 */
const getSortOrder = (field: SortField) => (sortField.value === field ? sortOrder.value : 'none');

/** 服务器模式文案（字典 game_server_mode 渲染，未配置模式归入「未分组」） */
const getServerModeLabel = (mode: number | null): string => {
  if (mode === null) return t('server.unknownMode');
  const label = dictLabel('game_server_mode', String(mode));
  if (label) return label;
  const fallbackKey = `server.mode${mode}`;
  return t(fallbackKey) === fallbackKey ? t('server.modeFallback', { mode }) : t(fallbackKey);
};

/** 按服务器模式分区展示（组内保持排序与在线优先、离线置底；字典顺序排列，未知模式置底） */
const groupedServers = computed<{ mode: number | null; label: string; servers: Api.Game.SeverVo[] }[]>(() => {
  const indexMap = new Map<string, number>();
  const result: { mode: number | null; label: string; servers: Api.Game.SeverVo[] }[] = [];

  sortedServers.value.forEach(server => {
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
</script>

<template>
  <div class="table-wrapper">
    <div class="custom-table" v-show="servers.length > 0">
      <!-- 表头 -->
      <div class="custom-thead">
        <div class="th th-name">{{ $t('server.serverName') }}</div>
        <div class="th th-map">{{ $t('server.map') }}</div>
        <div class="th th-players sortable" @click="toggleSort('players')">
          <span>{{ $t('server.playerCountColumn') }}</span>
          <Icon
            v-if="getSortOrder('players') === 'asc'"
            icon="heroicons:chevron-up"
            class="sort-icon"
          />
          <Icon
            v-else-if="getSortOrder('players') === 'desc'"
            icon="heroicons:chevron-down"
            class="sort-icon"
          />
          <Icon v-else icon="heroicons:chevron-up-down" class="sort-icon" />
        </div>
        <div class="th th-score">{{ $t('server.score') }}</div>
        <div class="th th-runtime">{{ $t('server.mapRuntime') }}</div>
        <div class="th th-action">{{ $t('server.operate') }}</div>
      </div>

      <!-- 表体 -->
      <div class="custom-tbody">
        <template v-for="group in groupedServers" :key="group.mode ?? 'none'">
          <!-- 模式分区标题 -->
          <div class="mode-section-header">
            <span class="mode-section-label">{{ group.label }}</span>
            <span class="mode-count">{{ $t('server.serverCount', { count: group.servers.length }) }}</span>
          </div>
        <div
          v-for="(server, index) in group.servers"
          :key="`${server.serverId}-${index}`"
          class="custom-row"
          :class="{ 'offline-row': isServerOffline(server) }"
          :style="{ '--delay': `${Math.min(index * 0.05, 0.4)}s` }"
        >
          <!-- 服务器名 -->
          <div class="td td-name">
            <div class="name-cell">
              <span class="status-dot" :class="isServerOffline(server) ? 'offline' : 'online'" />
              <span class="name-text" :title="server.serverName || server.connectStr">
                {{ server.serverName || server.connectStr }}
              </span>
            </div>
          </div>

          <!-- 地图 -->
          <div class="td td-map">
            <div class="map-box">
              <span class="map-name" :title="server.mapName">{{ server.mapName }}</span>
              <span v-if="server.mapLabel" class="map-label">{{ server.mapLabel }}</span>
              <div v-if="server.type || server.tag?.length" class="map-tags">
                <span
                  v-if="server.type"
                  class="tag tag-type"
                  :style="{ '--tag-color': getTypeColor(server.type) }"
                >
                  {{ getTypeLabel(server.type) }}
                </span>
                <span v-for="(tag, idx) in server.tag" :key="idx" class="tag tag-item">{{ getTagLabel(tag) }}</span>
              </div>
            </div>
          </div>

          <!-- 玩家数 -->
          <div class="td td-players">
            <div class="player-count-cell">
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{
                    width: `${getPlayerPercent(server)}%`,
                    backgroundColor: getPlayerColor(server.numPlayers),
                    boxShadow: `0 0 8px ${getPlayerColor(server.numPlayers)}`
                  }"
                />
              </div>
              <span class="player-count-text">
                {{ server.numPlayers || 0 }}<span class="count-sep">/</span>{{ server.maxPlayers || 0 }}
              </span>
            </div>
          </div>

          <!-- 比分 -->
          <div class="td td-score">
            <span
              v-if="server.mapPhase"
              class="stat-chip"
              :style="{ '--chip-color': getScoreChipColor(server) }"
            >
              <span class="team-ct">{{ server.CTScore || 0 }}</span>
              <span class="score-phase">{{ getMapPhaseText(server.mapPhase) }}</span>
              <span class="team-t">{{ server.TScore || 0 }}</span>
            </span>
            <span v-else class="empty-score">-</span>
          </div>

          <!-- 换图时长 -->
          <div class="td td-runtime">
            <span class="runtime-chip">
              <Icon icon="heroicons:clock" class="runtime-icon" />
              {{ formatMapRuntimeCn(server.dateTimeOriginal) }}
            </span>
          </div>

          <!-- 操作 -->
          <div class="td td-action">
            <div class="action-cell">
              <button class="action-btn copy-btn" :title="$t('server.copyAddr')" @click="emit('copy', server)">
                <Icon icon="heroicons:clipboard-document" class="action-icon" />
              </button>
              <button class="action-btn join-btn" :title="$t('server.joinServer')" @click="emit('join', server)">
                <Icon icon="heroicons:play" class="action-icon" />
              </button>
              <button class="action-btn auto-btn" :title="$t('server.autoJoin')" @click="emit('autoJoin', server)">
                <Icon icon="heroicons:rocket-launch" class="action-icon" />
              </button>
            </div>
          </div>
        </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 主题自适应：颜色基于 daisyUI 前景色变量 --color-base-content，随深/浅色主题变化 */

.table-wrapper {
  padding: 10px;
  overflow: auto;
}

.custom-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 810px;
}

.custom-thead {
  display: grid;
  grid-template-columns: 2fr 1.5fr 100px 170px 90px 130px;
  gap: 12px;
  padding: 0 16px 8px;
  border-bottom: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);

  .th {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.sortable {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
      transition: color 0.2s ease;

      &:hover {
        color: color-mix(in oklab, var(--color-base-content) 90%, transparent);
      }

      .sort-icon {
        width: 16px;
        height: 16px;
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
}

.custom-tbody {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 模式分区标题（与启动器表格版一致） */
.mode-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 16px 0;
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

.custom-row {
  position: relative;
  display: grid;
  grid-template-columns: 2fr 1.5fr 100px 170px 90px 130px;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--color-base-content) 3%, transparent);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 3px 8px rgba(0, 0, 0, 0.06);
  }

  &.offline-row {
    background: rgba(255, 77, 79, 0.08);
    box-shadow: 0 1px 3px rgba(255, 77, 79, 0.08), 0 1px 2px rgba(255, 77, 79, 0.05);

    &:hover {
      box-shadow: 0 8px 24px rgba(255, 77, 79, 0.14), 0 3px 8px rgba(255, 77, 79, 0.08);
    }
  }

  .td {
    min-width: 0;
    display: flex;
    align-items: center;
  }
}

/* 服务器名 */
.td-name {
  .name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 6px currentColor;

    &.online {
      background: #52c41a;
      color: #52c41a;
    }

    &.offline {
      background: #9ca3af;
      color: #9ca3af;
    }
  }

  .name-text {
    font-size: 14px;
    font-weight: 700;
    color: color-mix(in oklab, var(--color-base-content) 95%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 地图 */
.td-map {
  .map-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .map-name {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 90%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .map-label {
    font-size: 12px;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .map-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    overflow: hidden;

    .tag {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      height: 18px;
      padding: 0 6px;
      border-radius: 9px;
      font-size: 10.5px;
      font-weight: 600;
      white-space: nowrap;

      &.tag-type {
        background: color-mix(in oklab, var(--tag-color, #667eea) 18%, transparent);
        color: color-mix(in oklab, var(--tag-color, #667eea) 55%, var(--color-base-content));
        border: 1px solid color-mix(in oklab, var(--tag-color, #667eea) 30%, transparent);
      }

      &.tag-item {
        background: color-mix(in oklab, #22c55e 14%, transparent);
        color: color-mix(in oklab, #22c55e 45%, var(--color-base-content));
        border: 1px solid color-mix(in oklab, #22c55e 28%, transparent);
      }
    }
  }
}

/* 玩家数 */
.td-players {
  .player-count-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .progress-track {
    flex: 1;
    height: 7px;
    border-radius: 3.5px;
    overflow: hidden;
    background: color-mix(in oklab, var(--color-base-content) 15%, transparent);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .progress-fill {
    height: 100%;
    border-radius: 3.5px;
    transition: width 0.3s ease;
  }

  .player-count-text {
    font-size: 12px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
    white-space: nowrap;
  }

  .count-sep {
    margin: 0 2px;
    opacity: 0.45;
    font-weight: 400;
  }
}

/* 比分 */
.td-score {
  .stat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
    border: 1px solid color-mix(in oklab, var(--chip-color) 30%, transparent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
  }

  .team-ct {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #60a5fa;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      background: #60a5fa;
      box-shadow: 0 0 4px rgba(96, 165, 250, 0.6);
    }
  }

  .team-t {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #fbbf24;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      background: #fbbf24;
      box-shadow: 0 0 4px rgba(251, 191, 36, 0.6);
    }
  }

  .score-phase {
    font-size: 10px;
    opacity: 0.7;
    font-weight: 500;
    padding: 1px 6px;
    background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
    border-radius: 4px;
    text-transform: capitalize;
  }

  .empty-score {
    font-size: 12px;
    color: color-mix(in oklab, var(--color-base-content) 60%, transparent);
  }
}

/* 换图时长（按钮风格） */
.td-runtime {
  .runtime-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 22px;
    padding: 0 8px;
    border-radius: 11px;
    font-size: 12px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 75%, transparent);
    background: color-mix(in oklab, var(--color-base-content) 6%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-base-content) 15%, transparent);
    white-space: nowrap;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    .runtime-icon {
      font-size: 13px;
      color: #667eea;
    }

    &:hover {
      background: rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
    }
  }
}

/* 操作 */
.td-action {
  .action-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    .action-icon {
      font-size: 20px;
    }

    &:active {
      transform: scale(0.95);
    }

    &.copy-btn {
      color: rgba(56, 189, 248, 0.85);
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);

      &:hover {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        border-color: rgba(56, 189, 248, 0.4);
      }
    }

    &.join-btn {
      color: rgba(34, 197, 94, 0.85);
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.2);

      &:hover {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        border-color: rgba(34, 197, 94, 0.4);
      }
    }

    &.auto-btn {
      color: rgba(249, 115, 22, 0.85);
      background: rgba(249, 115, 22, 0.08);
      border: 1px solid rgba(249, 115, 22, 0.2);

      &:hover {
        background: rgba(249, 115, 22, 0.2);
        color: #f97316;
        border-color: rgba(249, 115, 22, 0.4);
      }
    }
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
