import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

/**
 * 服务器比赛阶段文案（来自 i18n server.mapPhase.*，未配置时返回原值）
 */
export function getMapPhaseText(phase?: string | null): string {
  if (!phase) return '';
  const { t } = useI18n();
  const key = `server.mapPhase.${phase}`;
  const translated = t(key);
  return translated === key ? phase : translated;
}

/** 计算目标时间距现在的分钟数（不小于 0） */
export function calculatePastMinutes(time?: string | null): number {
  if (!time) return 0;
  return Math.max(dayjs().diff(dayjs(time), 'minute'), 0);
}

/** 地图运行时长（中文，时/分钟后缀）：X分钟 / X时Y分钟（无换图时间返回 '-'） */
export function formatMapRuntimeCn(time?: string | null): string {
  if (!time) return '-';
  const minutes = Math.max(dayjs().diff(dayjs(time), 'minute'), 0);
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}时${mins}分钟` : `${hours}时`;
}

/** 地图运行时长（中文，后缀单位为分钟）：X分钟 / X小时Y分钟（无换图时间返回 '-'） */
export function formatMapRuntimeZh(time?: string | null): string {
  if (!time) return '-';
  const minutes = Math.max(dayjs().diff(dayjs(time), 'minute'), 0);
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
}

/** 在线人数等级（1-5），用于人数方格与徽标颜色 */
export function getPlayerLevel(numPlayers: number): number {
  if (numPlayers <= 20) return 1;
  if (numPlayers <= 40) return 2;
  if (numPlayers <= 60) return 3;
  if (numPlayers <= 80) return 4;
  return 5;
}

/** 在线人数对应的颜色（表格进度条） */
export function getPlayerColor(players: number): string {
  if (players <= 20) return '#52c41a';
  if (players <= 40) return '#4096ff';
  if (players <= 60) return '#faad14';
  if (players <= 80) return '#ff7a45';
  return '#ff4d4f';
}

/** 人数等级对应的发光主色（卡片玩家徽标 / 人数方格） */
export const PLAYER_LEVEL_COLORS: Record<number, string> = {
  1: '#00f91a',
  2: '#5470ee',
  3: '#ffa325',
  4: '#ff4f00',
  5: '#ff0000'
};

/** 比分等级（CT 领先 / T 领先 / 平局） */
export type ScoreLevel = 'ct' | 't' | 'draw';

/** 计算比分等级：CT 领先 → 蓝，T 领先 → 金，平局 → 中性 */
export function getScoreLevel(ctScore?: string | null, tScore?: string | null): ScoreLevel {
  const ct = Number(ctScore) || 0;
  const t = Number(tScore) || 0;
  if (ct > t) return 'ct';
  if (t > ct) return 't';
  return 'draw';
}

/** 比分等级对应的发光主色 */
export const SCORE_COLORS: Record<ScoreLevel, string> = {
  ct: '#60a5fa',
  t: '#fbbf24',
  draw: '#ffffff'
};

/** 字典渲染类型（naive 主题色）→ 十六进制主色（daisyUI 场景使用） */
const DICT_TYPE_COLORS: Record<string, string> = {
  default: '#667eea',
  success: '#22c55e',
  info: '#38bdf8',
  warning: '#f59e0b',
  error: '#ef4444'
};

/** 将字典 type 字段转换为十六进制主色（未配置时使用默认 indigo） */
export function getTypeColorHex(type?: string | null): string {
  if (!type) return DICT_TYPE_COLORS.default;
  return DICT_TYPE_COLORS[type] || DICT_TYPE_COLORS.default;
}

/**
 * 从服务器名称中提取编号（取最后一个 "#数字"，如 "[僵尸乐园] 僵尸逃跑 #5" → 5），未找到返回 null
 */
export function getServerNameNumber(name?: string | null): number | null {
  if (!name) return null;
  const matches = name.match(/#\d+/g);
  if (!matches) return null;
  return Number(matches[matches.length - 1].slice(1));
}

/**
 * 服务器排序比较：编号(#N)优先，无编号的按 sort 值升序（0 最前，null 置底）。
 * - 两个都有编号：按编号升序（保证 #1 在 #5 前，与 sort 值无关）
 * - 有编号 vs 无编号：有编号的排前面
 * - 都无编号：按 sort 升序，sort 相同按服务器名自然排序
 */
export function compareServerSort(a: Api.Game.SeverVo, b: Api.Game.SeverVo): number {
  const na = getServerNameNumber(a.serverName);
  const nb = getServerNameNumber(b.serverName);
  if (na !== null || nb !== null) {
    if (na === null) return 1;
    if (nb === null) return -1;
    return na - nb;
  }
  const sa = a.sort ?? Number.MAX_SAFE_INTEGER;
  const sb = b.sort ?? Number.MAX_SAFE_INTEGER;
  if (sa !== sb) return sa - sb;
  return (a.serverName || '').localeCompare(b.serverName || '', undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}
