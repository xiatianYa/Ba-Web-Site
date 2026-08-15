import { useGameStore } from '@/store/modules/game';
import { updateServerGameData } from './data-updater';
import { notifyCs2QueryResult } from './cs2-query';
import type { MessageHandlers } from './types';

/**
 * 构建 WebSocket 消息处理函数映射
 * code 对应关系:
 *   202 服务器列表数据（ServerVo[]）
 *   204 服务器游戏实时数据（ServerGameDataVo）
 *   114 CS2 服务器查询结果（自动挤服，data 为 true/false）
 */
export function createMessageHandlers(): MessageHandlers {
  const gameStore = useGameStore();

  return {
    // 服务器列表数据
    '202': (data) => {
      if (Array.isArray(data)) {
        gameStore.applyWsServerList(data as Api.Game.SeverVo[]);
      }
    },

    // 服务器游戏实时数据（全量）
    '204': (data) => {
      updateServerGameData(data as Api.Game.ServerGameDataVo, false);
    },

    // CS2 服务器查询结果（自动挤服）
    '114': (data) => {
      notifyCs2QueryResult(Boolean(data));
    }
  };
}
