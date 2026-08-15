/** WebSocket 服务端连接实例类型 */
export interface ServerWebsocketType {
  ws: WebSocket | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectInterval: number;
  /** 是否主动关闭（主动关闭时不自动重连） */
  manualClose: boolean;
  init(): void;
  onClose(): void;
  reconnect(): void;
  close(): void;
  /** 发送消息（type 为消息码，data 为字符串载荷），连接未就绪返回 false */
  send(type: string, data: string): boolean;
}

/** 消息处理函数类型 */
export type MessageHandler = (data: unknown) => void;

/** 消息 handlers 映射类型（key：消息 code） */
export type MessageHandlers = Record<string, MessageHandler>;
