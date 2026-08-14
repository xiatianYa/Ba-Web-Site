import { defineStore } from 'pinia';
import { fetchGetCommunityList } from '@/service/api';
import { isSuccessResult } from '@/service/request';

/** WebSocket 连接状态 */
export type WsStatus = 'connecting' | 'open' | 'closed';

/** 游戏数据 store：管理 WS 推送的服务器列表、实时数据与社区分类 */
export const useGameStore = defineStore('game', {
  state: () => ({
    /** WS 推送的服务器列表（code=202） */
    serverList: [] as Api.Game.SeverVo[],
    /** 服务器游戏实时数据映射（code=204） */
    serverGameDataMap: {
      serverInfoMap: {} as Record<string, Api.Game.ServerInfoData>,
      userGameDataMap: {} as Record<string, Api.Game.UserGameData[]>,
      playerActionMap: {} as Record<string, Api.Game.PlayerActionLog[]>
    },
    /** 社区列表（来自 /gameCommunity/list） */
    communityList: [] as Api.Game.GameCommunityVo[],
    /** 当前选中的社区 ID（null 表示全部） */
    selectedCommunityId: null as number | null,
    /** WS 连接状态 */
    wsStatus: 'closed' as WsStatus
  }),
  getters: {
    /** 在线服务器列表 */
    onlineServers(state): Api.Game.SeverVo[] {
      return state.serverList.filter(s => s.isOnline);
    },
    /** 在线服务器总人数 */
    onlinePlayers(state): number {
      return state.serverList
        .filter(s => s.isOnline)
        .reduce((sum, s) => sum + (s.numPlayers || 0), 0);
    },
    /** 按社区过滤后的服务器列表（未选中社区时返回全部） */
    filteredServerList(state): Api.Game.SeverVo[] {
      if (state.selectedCommunityId === null) return state.serverList;
      return state.serverList.filter(s => s.communityId === state.selectedCommunityId);
    },
    /** 按服务器ID获取玩家列表 */
    playersOf(state): (serverId: number | string) => Api.Game.UserGameData[] {
      return (serverId) => state.serverGameDataMap.userGameDataMap[String(serverId)] || [];
    },
    /** 各社区在线人数映射（按 serverList 实时汇总） */
    communityOnlineCountMap(state): Record<number, number> {
      const map: Record<number, number> = {};
      state.serverList.forEach(server => {
        if (server.communityId == null) return;
        map[server.communityId] = (map[server.communityId] ?? 0) + (server.numPlayers || 0);
      });
      return map;
    },
    /** 各社区服务器数量映射（按 serverList 实时统计） */
    communityServerCountMap(state): Record<number, number> {
      const map: Record<number, number> = {};
      state.serverList.forEach(server => {
        if (server.communityId == null) return;
        map[server.communityId] = (map[server.communityId] ?? 0) + 1;
      });
      return map;
    }
  },
  actions: {
    /** 202：全量替换服务器列表 */
    applyWsServerList(list: Api.Game.SeverVo[]) {
      this.serverList.splice(0, this.serverList.length, ...list);
    },
    /** 更新 WS 连接状态 */
    setWsStatus(status: WsStatus) {
      this.wsStatus = status;
    },
    /** 查询社区列表（/gameCommunity/list），首次加载默认选中第一个社区 */
    async fetchCommunityList() {
      const res = await fetchGetCommunityList();
      if (isSuccessResult(res) && res.data) {
        this.communityList.splice(0, this.communityList.length, ...res.data);
        // 无「全部」选项：加载到社区后默认选中第一个，避免列表为空过滤
        if (this.selectedCommunityId === null && this.communityList.length > 0) {
          this.selectedCommunityId = this.communityList[0].id;
        }
      }
    },
    /** 选中/切换社区（null 表示全部） */
    selectCommunity(id: number | null) {
      this.selectedCommunityId = id;
    }
  }
});
