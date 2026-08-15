<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/store/modules/game';
import { $t } from '@/locales';

defineOptions({ name: 'OnlinePlayerStats' });

const gameStore = useGameStore();

/** 在线规模统计项 */
const stats = computed(() => {
  const onlineServers = gameStore.serverList.filter(s => s.isOnline);
  const totalPlayers = onlineServers.reduce((sum, s) => sum + (s.numPlayers || 0), 0);
  return [
    {
      icon: 'heroicons:server-stack',
      label: $t('home.dash.serversOnline'),
      value: onlineServers.length
    },
    {
      icon: 'heroicons:user-group',
      label: $t('home.dash.playersOnline'),
      value: totalPlayers
    },
    {
      icon: 'heroicons:building-library',
      label: $t('home.dash.totalCommunities'),
      value: gameStore.communityList.length
    }
  ];
});
</script>

<template>
  <div class="player-stats-banner" v-reveal="0" data-reveal="up">
    <!-- 标题 -->
    <div class="banner-title">
      <span class="dash-title-icon"><Icon icon="heroicons:user-group" class="h-4 w-4" /></span>
      <div class="flex flex-col leading-tight">
        <span>{{ $t('home.dash.playerStats') }}</span>
        <span class="text-[11px] font-normal text-base-content/50">{{
          $t('home.dash.playerStatsDesc')
        }}</span>
      </div>
    </div>

    <!-- 统计项 -->
    <div class="banner-stats">
      <div v-for="item in stats" :key="item.label" class="banner-stat">
        <Icon :icon="item.icon" class="banner-stat-icon" />
        <div class="flex flex-col leading-tight">
          <span class="banner-stat-value">{{ item.value }}</span>
          <span class="banner-stat-label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-stats-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-radius: 18px;
  border: 1px solid color-mix(in oklab, var(--color-primary) 25%, transparent);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(0, 150, 255, 0.04));
  box-shadow: 0 6px 24px rgba(0, 150, 255, 0.1);

  .banner-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 800;
    color: color-mix(in oklab, var(--color-base-content) 88%, transparent);
  }

  /* 三张卡片在首屏底部均分排布 */
  .banner-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    width: 100%;
    max-width: 680px;

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .banner-stat {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--color-base-100) 72%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-base-content) 7%, transparent);
    backdrop-filter: blur(4px);
    transition: all 0.2s ease;

    &:hover {
      border-color: color-mix(in oklab, var(--color-primary) 30%, transparent);
      transform: translateY(-2px);
    }

    .banner-stat-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: #0ea5e9;
    }

    .banner-stat-value {
      font-size: 22px;
      font-weight: 800;
      line-height: 1;
      color: transparent;
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      background-clip: text;
      -webkit-background-clip: text;
      font-variant-numeric: tabular-nums;
    }

    .banner-stat-label {
      margin-top: 3px;
      font-size: 11px;
      color: color-mix(in oklab, var(--color-base-content) 50%, transparent);
    }
  }
}
</style>
