import { useGameStore } from '@/store/modules/game';
import { useAuthStore } from '@/store/modules/auth';
import { createMessageHandlers } from './handlers';
import type { ServerWebsocketType } from './types';

const WS_BASE = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'ws://127.0.0.1:8080' : 'wss://www.bluearchive.top');

/**
 * WebSocket 路径前缀（与部署环境保持一致）：
 * - 开发环境直连后端 8080，路径与后端 @ServerEndpoint 一致（/ws/...）
 * - 生产环境经 nginx 反代，需携带 /websocket 前缀（nginx 映射 /websocket/ws/* → 后端 /ws/*）
 */
const WS_PATH = import.meta.env.DEV ? '/ws' : '/websocket/ws';

/**
 * 构建连接地址：
 * - 已登录：走鉴权端点 /ws/server/{token}（对应后端 @ServerEndpoint("/ws/server/{token}")），以路径参数传递 token
 * - 未登录：走公共端点 /ws/public/server（无需鉴权，推送服务器列表 202 / 游戏实时数据 204）
 */
function buildWsUrl(): string {
  const authStore = useAuthStore();
  if (authStore.isLogin) {
    return `${WS_BASE}${WS_PATH}/server/${authStore.accessToken}`;
  }
  return `${WS_BASE}${WS_PATH}/public/server`;
}

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

    const ws = new WebSocket(buildWsUrl());
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
  },

  /** 发送消息（与后端协议一致：{ type, data }），连接未就绪返回 false */
  send(type: string, data: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[SERVER-WS] 未连接，无法发送消息:', { type, data });
      return false;
    }
    this.ws.send(JSON.stringify({ type, data }));
    return true;
  }
};

/**
 * 通知后端玩家加入服务器（type=101，对应 CODE_JOIN_SERVER）
 * @param serverId 服务器ID
 */
export function sendMsgConnect(serverId: number | string): boolean {
  return ServerWebsocket.send('101', String(serverId));
}

export default ServerWebsocket;
