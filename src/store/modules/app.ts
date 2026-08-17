import { defineStore } from 'pinia';
import { usePreferredDark } from '@vueuse/core';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';

/** 深浅色主题对应的 daisyUI 主题名（定义于 src/style/index.css） */
const THEME_DARK = 'ba-dark';
const THEME_LIGHT = 'ba-light';

/** 应用主题到 html 根节点 */
function applyTheme(darkMode: boolean) {
  document.documentElement.dataset.theme = darkMode ? THEME_DARK : THEME_LIGHT;
}

/** 鼠标样式：default 系统默认样式 / animated 动画样式（ba-click-fx 特效） */
export type MouseStyle = 'default' | 'animated';

export const useAppStore = defineStore('app', {
  state: () => ({
    /** 是否为深色模式；未手动设置时跟随系统偏好 */
    darkMode:
      localStg.get(APP_STORAGE_KEYS.THEME_SCHEME) === 'dark' ||
      (localStg.get(APP_STORAGE_KEYS.THEME_SCHEME) === null && usePreferredDark().value),
    /** 鼠标样式；未手动设置时默认动画样式（保持原有特效） */
    mouseStyle: (localStg.get(APP_STORAGE_KEYS.MOUSE_STYLE) ?? 'animated') as MouseStyle
  }),
  actions: {
    /** 应用挂载时初始化主题 */
    initTheme() {
      applyTheme(this.darkMode);
    },
    /** 切换深浅色主题并持久化 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStg.set(APP_STORAGE_KEYS.THEME_SCHEME, this.darkMode ? 'dark' : 'light');
      applyTheme(this.darkMode);
    },
    /** 切换鼠标样式并持久化 */
    setMouseStyle(style: MouseStyle) {
      this.mouseStyle = style;
      localStg.set(APP_STORAGE_KEYS.MOUSE_STYLE, style);
    }
  }
});
