import { ref } from 'vue';
import ServerWebsocket from '@/utils/ws/server';
import { registerCs2QueryResolver } from '@/utils/ws/cs2-query';

/** 自动挤服结果：found=检测到空位 stopped=用户停止 error=WS 不可用 */
export type AutoJoinResult = 'found' | 'stopped' | 'error';

/** 单次查询超时兜底（后端 UDP 查询无响应时不再无限等待，视为不满足并进入下一轮） */
const QUERY_TIMEOUT = 8000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 发起一次 type=114 查询并等待后端返回
 * @returns true=可进入 / false=不满足或超时 / null=连接不可用
 */
function queryServer(address: string, judgeCount: number): Promise<boolean | null> {
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      registerCs2QueryResolver(() => {}); // 清除挂起的回调，避免残留
      resolve(false);
    }, QUERY_TIMEOUT);

    registerCs2QueryResolver(result => {
      clearTimeout(timeout);
      resolve(result);
    });

    const sent = ServerWebsocket.send('114', JSON.stringify({ address, judgeCount }));
    if (!sent) {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}

/**
 * 自动挤服（需登录，走鉴权 WS 端点）
 *
 * 流程：开启后循环发送 type=114 查询（携带 QueryCs2ServerVo: address + judgeCount），
 * 必须等待服务器端返回结果后再发送下一条：
 * - 返回 true（在线人数 ≤ 判断人数）→ 结束，视为找到空位
 * - 返回 false → 间隔 delayMs 后重发，直到成功或用户停止
 */
export function useAutoJoin() {
  const isAutoJoining = ref(false);
  const autoJoinStatus = ref<'' | 'querying' | 'found' | 'error'>('');
  let stopped = true;

  async function startAutoJoin(
    server: Api.Game.SeverVo,
    judgeCount: number,
    delayMs: number
  ): Promise<AutoJoinResult> {
    stopAutoJoin();
    stopped = false;
    isAutoJoining.value = true;
    autoJoinStatus.value = 'querying';

    while (!stopped) {
      const result = await queryServer(server.connectStr, judgeCount);
      if (stopped) break;

      if (result === null) {
        stopped = true;
        isAutoJoining.value = false;
        autoJoinStatus.value = 'error';
        return 'error';
      }
      if (result) {
        stopped = true;
        isAutoJoining.value = false;
        autoJoinStatus.value = 'found';
        return 'found';
      }
      await sleep(delayMs);
    }

    isAutoJoining.value = false;
    return 'stopped';
  }

  function stopAutoJoin(): void {
    stopped = true;
    isAutoJoining.value = false;
  }

  return { isAutoJoining, autoJoinStatus, startAutoJoin, stopAutoJoin };
}
