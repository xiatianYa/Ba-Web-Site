import { useGameStore } from '@/store/modules/game';
import { createMessageHandlers } from './handlers';
import type { ServerWebsocketType } from './types';

/**
 * 服务器实时数据 WebSocket（对应后端 @ServerEndpoint("/ws/public/server")）
 * 公共端点，无需鉴权，推送服务器列表（202）与游戏实时数据（204）
 */
const WS_URL = `${import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'ws://127.0.0.1:8080' : 'wss://www.bluearchive.top')}/ws/public/server`;

/** 服务器 WebSocket 单例实例 */
const ServerWebsocket: ServerWebsocketType = {
  ws: null,
  reconnectTimer: null,
  reconnectInterval: 8000,
  manualClose: false,

  /** 建立 WebSocket 连接 */
  init(): void {
    this.close();

    const gameStore = useGameStore();
    gameStore.setWsStatus('connecting');

    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    // 连接成功
    ws.onopen = () => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.ws === ws) {
        useGameStore().setWsStatus('open');
      }
    };

    // 监听服务器推送的数据
    ws.onmessage = (e: MessageEvent) => {
      try {
        const { code, data } = JSON.parse(e.data);
        const handler = createMessageHandlers()[code];
        if (handler) {
          handler(data);
        }
      } catch (error) {
        console.error('WebSocket 消息解析异常:', error);
      }
    };

    // 连接断开时触发
    ws.onclose = () => {
      if (this.ws !== ws) return;
      useGameStore().setWsStatus('closed');
      this.onClose();
    };

    ws.onerror = (e) => {
      console.error('WebSocket error:', e);
    };
  },

  /** 处理断开连接操作（主动关闭不重连） */
  onClose(): void {
    if (this.manualClose) return;
    this.reconnect();
  },

  /** 重新连接 */
  reconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.init();
    }, this.reconnectInterval);
  },

  /** 关闭连接（主动关闭，不再自动重连） */
  close(): void {
    this.manualClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    this.manualClose = false;
  }
};

export default ServerWebsocket;
