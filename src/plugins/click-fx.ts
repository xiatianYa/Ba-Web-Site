import { BAClickFX } from 'ba-click-fx';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';

/** 全局碧蓝档案风格鼠标点击特效实例 */
let fx: BAClickFX | null = null;

/** 是否已启用动画鼠标样式（默认启用，用户可在设置中选择关闭） */
export function isClickFxEnabled(): boolean {
  return localStg.get(APP_STORAGE_KEYS.MOUSE_STYLE) !== 'default';
}

/** 初始化全局点击特效：按用户设置的鼠标样式决定是否启用（仅浏览器环境） */
export function setupClickFx() {
  if (typeof window === 'undefined') return;
  if (!isClickFxEnabled()) return;
  enableClickFx();
}

/** 启用动画鼠标样式（全屏覆盖层，拖尾无需按住按键） */
export function enableClickFx() {
  if (fx || typeof window === 'undefined') return;
  fx = new BAClickFX({ trailAlways: true });
}

/** 关闭动画鼠标样式，恢复系统默认鼠标 */
export function disableClickFx() {
  if (!fx) return;
  fx.destroy();
  fx = null;
}
