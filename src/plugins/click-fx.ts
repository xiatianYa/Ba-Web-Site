import { BAClickFX } from 'ba-click-fx';

/** 全局蔚蓝档案风格鼠标点击特效实例 */
let fx: BAClickFX | null = null;

/** 初始化全局点击特效（默认全屏覆盖层，仅在浏览器环境下生效一次） */
export function setupClickFx() {
  if (fx || typeof window === 'undefined') return;

  // trailAlways: 鼠标移动即显示拖尾，无需按住按键
  fx = new BAClickFX({ trailAlways: true });
}
