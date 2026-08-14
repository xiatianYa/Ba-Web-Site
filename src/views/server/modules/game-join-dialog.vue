<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';
import { useDict } from '@/hooks/business/use-dict';

defineOptions({ name: 'GameJoinDialog' });

const props = defineProps<{
  visible: boolean;
  server: Api.Game.SeverVo | null;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'startJoin', server: Api.Game.SeverVo): void;
}>();

const { dictOptions, dictLabel } = useDict();

/** 挤服配置（本地持久化，参照启动器 automaticJoinConfig） */
interface JoinConfig {
  /** 触发挤服人数（1-63） */
  joinPerson: number;
  /** 挤服延迟（ms，0-5000） */
  joinDelay: number;
}

const DEFAULT_CONFIG: JoinConfig = { joinPerson: 1, joinDelay: 300 };

const joinConfig = ref<JoinConfig>({
  ...DEFAULT_CONFIG,
  ...(localStg.get(APP_STORAGE_KEYS.GAME_JOIN_CONFIG) as Partial<JoinConfig> | null)
});

/** 配置变更后持久化 */
watch(
  joinConfig,
  cfg => {
    localStg.set(APP_STORAGE_KEYS.GAME_JOIN_CONFIG, cfg);
  },
  { deep: true }
);

/** 地图难度文案（game_type 字典） */
const typeLabel = computed(() => {
  if (!props.server) return '';
  const item = dictOptions('game_type').find(i => i.value === props.server!.type);
  return item?.label || props.server!.type;
});

/** 地图标签文案（game_tag 字典） */
const tagLabels = computed(() => {
  return props.server?.tag.map(tag => dictLabel('game_tag', tag) || tag) || [];
});

/** 在线人数百分比 */
const onlinePercent = computed(() => {
  const s = props.server;
  if (!s) return 0;
  return Math.min(100, Math.round(((s.numPlayers || 0) / (s.maxPlayers || 1)) * 100));
});

/** 复制服务器连接指令（带「已复制」反馈） */
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

async function copyConnectStr() {
  const s = props.server;
  if (!s) return;
  try {
    await navigator.clipboard.writeText(s.connectStr);
    copied.value = true;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1500);
  } catch {
    /* 剪贴板不可用时静默失败 */
  }
}

function handleCancel() {
  emit('update:visible', false);
}

/** 开始挤服：Web 端无法直接启动游戏，交由父级复制 steam 连接指令并提示 */
function handleStartJoin() {
  if (!props.server) return;
  emit('startJoin', props.server);
}

/** Esc 关闭 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) handleCancel();
}

/** 锁定/恢复页面滚动（补偿滚动条宽度，避免页面横向跳动） */
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

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  lockScroll(false);
  if (copiedTimer) clearTimeout(copiedTimer);
});

watch(
  () => props.visible,
  visible => {
    lockScroll(visible);
  }
);
</script>

<template>
  <Transition name="join">
    <div
      v-if="visible && server"
      class="join-overlay"
      role="dialog"
      aria-modal="true"
      @click.self="handleCancel"
    >
      <div class="join-card">
        <!-- 头部：服务器当前信息（地图背景 + 深色遮罩） -->
        <header class="join-header">
          <img v-if="server.mapUrl" :src="server.mapUrl" loading="lazy" class="join-bg" alt="" />
          <div class="join-mask" />
          <button class="join-close" :aria-label="$t('common.cancel')" @click="handleCancel">
            <Icon icon="heroicons:x-mark" class="h-5 w-5" />
          </button>

          <div class="join-head-content">
            <span class="join-online" :style="{ width: `${onlinePercent}%` }" />
            <div class="join-name">{{ server.serverName }}</div>
            <div class="join-map-row">
              <span class="join-map-label">
                <Icon icon="heroicons:language" class="join-map-icon" />
                {{ server.mapLabel || $t('server.noTranslation') }}
              </span>
              <span class="join-map-name">{{ server.mapName }}</span>
            </div>
            <div class="join-meta">
              <span class="join-chip">
                <Icon icon="heroicons:user-group" class="join-chip-icon" />
                {{ server.numPlayers }}/{{ server.maxPlayers }}
              </span>
              <span v-if="server.type" class="join-chip">{{ typeLabel }}</span>
              <span v-for="(tag, idx) in tagLabels" :key="idx" class="join-chip">{{ tag }}</span>
              <span v-if="server.CTScore != null" class="join-chip join-score">
                <span class="team-ct">{{ server.CTScore }}</span>
                <span class="score-sep">:</span>
                <span class="team-t">{{ server.TScore }}</span>
              </span>
            </div>
            <div class="join-addr">
              <button
                class="join-copy"
                :class="{ copied }"
                :title="$t('server.copyAddr')"
                @click="copyConnectStr"
              >
                <Icon :icon="copied ? 'heroicons:check' : 'heroicons:clipboard-document'" class="h-3.5 w-3.5" />
              </button>
              <span class="join-addr-text">{{ server.connectStr }}</span>
              <Transition name="copied">
                <span v-if="copied" class="join-copied-tip">{{ $t('server.joinDialog.copiedTip') }}</span>
              </Transition>
            </div>
          </div>
        </header>

        <!-- 主体：挤服配置 -->
        <div class="join-body">
          <!-- 挤服人数设置 -->
          <div class="join-row">
            <div class="join-row-head">
              <span class="join-row-title">
                <Icon icon="heroicons:user-group" class="join-row-icon" />
                {{ $t('server.joinDialog.joinWhen') }}
              </span>
              <span class="join-row-value">{{ $t('server.joinDialog.personCount', { count: joinConfig.joinPerson }) }}</span>
            </div>
            <input
              v-model.number="joinConfig.joinPerson"
              type="range"
              min="1"
              max="63"
              step="1"
              class="range range-primary range-xs"
            />
            <div class="join-row-range">
              <span>1</span>
              <span>63</span>
            </div>
          </div>

          <!-- 挤服延迟参数 -->
          <div class="join-row">
            <div class="join-row-head">
              <span class="join-row-title">
                <Icon icon="heroicons:clock" class="join-row-icon" />
                {{ $t('server.joinDialog.joinDelay') }}
              </span>
              <span class="join-row-value">{{ $t('server.joinDialog.delayMs', { delay: joinConfig.joinDelay }) }}</span>
            </div>
            <input
              v-model.number="joinConfig.joinDelay"
              type="range"
              min="0"
              max="5000"
              step="100"
              class="range range-primary range-xs"
            />
            <div class="join-row-range">
              <span>0ms</span>
              <span>5000ms</span>
            </div>
            <p class="join-row-desc">{{ $t('server.joinDialog.delayTip') }}</p>
          </div>
        </div>

        <!-- 底部操作 -->
        <footer class="join-footer">
          <button class="join-btn-ghost" @click="handleCancel">{{ $t('common.cancel') }}</button>
          <button class="join-btn-primary" @click="handleStartJoin">
            <Icon icon="heroicons:rocket-launch" class="join-btn-icon" />
            {{ $t('server.joinDialog.startJoin') }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
/* ---------- 遮罩层 ---------- */
.join-overlay {
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

.join-card {
  width: 100%;
  max-width: 26rem;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);
  background: var(--color-base-100);
  box-shadow: 0 24px 64px -16px rgba(2, 6, 23, 0.45);
}

/* ---------- 头部：服务器信息 ---------- */
.join-header {
  position: relative;
  overflow: hidden;
  color: #fff;

  .join-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .join-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.55) 60%, rgba(0, 0, 0, 0.75) 100%);
  }

  .join-close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 9999px;
    background: rgba(0, 0, 0, 0.35);
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.55);
      transform: scale(1.05);
    }
    &:active {
      transform: scale(0.92);
    }
  }

  .join-head-content {
    position: relative;
    z-index: 1;
    padding: 30px 20px 16px;
  }

  .join-online {
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #22c55e, #60a5fa);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
  }

  .join-name {
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .join-map-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    font-size: 13px;

    .join-map-label {
      display: inline-flex;
      align-items: center;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .join-map-icon {
        flex-shrink: 0;
        margin-right: 3px;
        color: #93c5fd;
      }
    }

    .join-map-name {
      flex-shrink: 0;
      opacity: 0.75;
    }
  }

  .join-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;

    .join-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 20px;
      padding: 0 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.18);

      .join-chip-icon {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #93c5fd;
      }

      &.join-score {
        .team-ct {
          color: #60a5fa;
        }
        .team-t {
          color: #fbbf24;
        }
        .score-sep {
          margin: 0 4px;
          opacity: 0.6;
        }
      }
    }
  }

  .join-addr {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.75);

    .join-copy {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      border: none;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.85);
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.28);
      }

      &.copied {
        background: rgba(34, 197, 94, 0.28);
        color: #4ade80;
      }
    }

    .join-addr-text {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .join-copied-tip {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 700;
      color: #4ade80;
    }
  }
}

/* ---------- 主体：挤服配置 ---------- */
.join-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px 20px 20px;
}

.join-row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  .join-row-title {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 75%, transparent);

    .join-row-icon {
      font-size: 15px;
      color: #667eea;
    }
  }

  .join-row-value {
    font-size: 13px;
    font-weight: 700;
    color: #667eea;
  }
}

.join-row-range {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  color: color-mix(in oklab, var(--color-base-content) 40%, transparent);
}

.join-row-desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
}

/* ---------- 底部 ---------- */
.join-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px 18px;
  border-top: 1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent);

  .join-btn-ghost {
    flex: 1;
    height: 38px;
    border: none;
    border-radius: 10px;
    background: color-mix(in oklab, var(--color-base-content) 5%, transparent);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 55%, transparent);
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in oklab, var(--color-base-content) 10%, transparent);
      color: color-mix(in oklab, var(--color-base-content) 80%, transparent);
    }
  }

  .join-btn-primary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 38px;
    border: none;
    border-radius: 10px;
    background: var(--color-primary);
    color: var(--color-primary-content);
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 2px 10px -2px color-mix(in oklab, var(--color-primary) 45%, transparent);
    transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;

    .join-btn-icon {
      font-size: 15px;
    }

    &:hover {
      filter: brightness(1.06);
      box-shadow: 0 6px 16px -4px color-mix(in oklab, var(--color-primary) 50%, transparent);
    }
    &:active {
      transform: scale(0.97);
    }
  }
}

/* ---------- 进出场动画 ---------- */
.join-enter-active {
  transition: opacity 0.25s ease;
}
.join-enter-active .join-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.join-leave-active {
  transition: opacity 0.2s ease;
}
.join-leave-active .join-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.join-enter-from {
  opacity: 0;
}
.join-enter-from .join-card {
  opacity: 0;
  transform: translateY(18px) scale(0.95);
}
.join-leave-to {
  opacity: 0;
}
.join-leave-to .join-card {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}

/* ---------- 「已复制」提示过渡 ---------- */
.copied-enter-active,
.copied-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.copied-enter-from,
.copied-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
