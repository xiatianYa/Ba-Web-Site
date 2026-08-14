<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/store/modules/game';

defineOptions({ name: 'CommunityList' });

defineProps<{ selectedId: number | null }>();

const emit = defineEmits<{
  (e: 'select', id: number | null): void;
}>();

const gameStore = useGameStore();
const { communityList, communityOnlineCountMap, communityServerCountMap } = storeToRefs(gameStore);

/** 社区在线人数（实时按服务器列表汇总，无数据时回退为 0） */
const getCommunityPlayerNumber = (id: number) => communityOnlineCountMap.value[id] ?? 0;

/** 社区服务器数量（实时按服务器列表统计，无数据时回退为接口值） */
const getCommunityServerNumber = (community: Api.Game.GameCommunityVo) =>
  communityServerCountMap.value[community.id] ?? community.serverNumber ?? 0;

/** 在线人数等级标签颜色：<300 绿 / <500 黄 / 其余红 */
const getOnlineTagColor = (count: number): string => {
  if (count < 300) return '#22c55e';
  if (count < 500) return '#f59e0b';
  return '#ef4444';
};

const handleSelect = (id: number | null) => {
  emit('select', id);
};
</script>

<template>
  <!-- 桌面端：右侧固定社区栏（sticky 跟随滚动） -->
  <aside class="sticky top-[68px] hidden w-60 shrink-0 self-start flex-col gap-2 lg:flex">
    <div class="flex items-center gap-2 px-1">
      <Icon icon="heroicons:server-stack" class="h-4 w-4 text-indigo-500" />
      <span class="text-sm font-bold text-base-content/70">{{ $t('server.communityList') }}</span>
    </div>

    <!-- 各社区 -->
    <button
      v-for="(community, index) in communityList"
      :key="community.id"
      class="community-item"
      :class="{ selected: selectedId === community.id }"
      :style="{ '--delay': `${Math.min(index * 0.04, 0.4)}s` }"
      @click="handleSelect(community.id)"
    >
      <img v-if="community.logo" :src="community.logo" loading="lazy" class="community-logo" alt="" />
      <span v-else class="community-logo logo-fallback">
        {{ community.communityName?.slice(0, 1) || '?' }}
      </span>
      <span class="community-info">
        <span class="community-name">{{ community.communityName }}</span>
        <span class="community-stats">
          {{ $t('server.serverCount', { count: getCommunityServerNumber(community) }) }}
        </span>
      </span>
      <span class="community-online">
        <span
          class="online-tag"
          :style="{ '--tag-color': getOnlineTagColor(getCommunityPlayerNumber(community.id)) }"
        >
          {{ $t('server.playerCount', { count: getCommunityPlayerNumber(community.id) }) }}
        </span>
      </span>
    </button>
  </aside>

  <!-- 移动端：顶部横向滚动 chips（order-first 使其排在列表上方） -->
  <div class="order-first lg:hidden">
    <div class="mb-3 flex items-center gap-2">
      <Icon icon="heroicons:server-stack" class="h-4 w-4 text-indigo-500" />
      <span class="text-sm font-bold text-base-content/70">{{ $t('server.communityList') }}</span>
    </div>
    <div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: thin">
      <button
        v-for="(community, index) in communityList"
        :key="community.id"
        class="community-chip"
        :class="{ selected: selectedId === community.id }"
        :style="{ '--delay': `${Math.min(index * 0.04, 0.4)}s` }"
        @click="handleSelect(community.id)"
      >
        <img v-if="community.logo" :src="community.logo" loading="lazy" class="chip-logo" alt="" />
        <span v-else class="chip-logo chip-logo-fallback">
          {{ community.communityName?.slice(0, 1) || '?' }}
        </span>
        <span class="chip-name">{{ community.communityName }}</span>
        <span class="chip-online">
          {{ $t('server.playerCount', { count: getCommunityPlayerNumber(community.id) }) }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 桌面端社区项（参考启动器 community-box 样式） */
.community-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: color-mix(in oklab, var(--color-base-content) 5%, transparent);
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  animation: fadeInUp 0.4s ease-out forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;

  &:hover {
    background: color-mix(in oklab, var(--color-base-content) 10%, transparent);
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &.selected {
    background: rgba(99, 102, 241, 0.15);
    border-color: #6366f1;
  }

  .community-logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: color-mix(in oklab, var(--color-base-content) 8%, transparent);
  }

  .logo-fallback {
    display: grid;
    place-items: center;
    color: #818cf8;
    font-size: 15px;
    font-weight: 700;
    background: rgba(99, 102, 241, 0.15);
  }

  .community-info {
    flex: 1;
    min-width: 0;
  }

  .community-name {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 90%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .community-stats {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    font-weight: 700;
    color: color-mix(in oklab, var(--color-base-content) 45%, transparent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .community-online {
    flex-shrink: 0;

    .online-tag {
      display: inline-flex;
      align-items: center;
      height: 20px;
      padding: 0 7px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--tag-color);
      background: color-mix(in oklab, var(--tag-color) 12%, transparent);
      border: 1px solid color-mix(in oklab, var(--tag-color) 30%, transparent);
    }
  }
}

/* 移动端 chips */
.community-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  border: 2px solid transparent;
  background: color-mix(in oklab, var(--color-base-content) 5%, transparent);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  animation: fadeInUp 0.4s ease-out forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;

  &:hover {
    background: color-mix(in oklab, var(--color-base-content) 10%, transparent);
    border-color: rgba(99, 102, 241, 0.6);
  }

  &.selected {
    background: rgba(99, 102, 241, 0.15);
    border-color: #6366f1;
  }

  .chip-logo {
    width: 22px;
    height: 22px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .chip-logo-fallback {
    display: grid;
    place-items: center;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    font-size: 10px;
    font-weight: 700;
  }

  .chip-name {
    font-size: 12px;
    font-weight: 600;
    color: color-mix(in oklab, var(--color-base-content) 85%, transparent);
    white-space: nowrap;
  }

  .chip-online {
    font-size: 11px;
    font-weight: 700;
    color: #22c55e;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
