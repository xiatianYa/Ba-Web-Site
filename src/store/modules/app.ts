import { defineStore } from 'pinia';

const THEME_KEY = 'theme';

/** 深浅色主题对应的 daisyUI 主题名（定义于 src/style.css） */
const THEME_DARK = 'ba-dark';
const THEME_LIGHT = 'ba-light';

export const useAppStore = defineStore('app', {
  state: () => ({
    /** 是否为深色模式（对应 daisyUI 的 data-theme） */
    darkMode: localStorage.getItem(THEME_KEY) === 'dark'
  }),
  actions: {
    /** 应用挂载时初始化主题 */
    initTheme() {
      document.documentElement.dataset.theme = this.darkMode ? THEME_DARK : THEME_LIGHT;
    },
    /** 切换深浅色主题并持久化 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem(THEME_KEY, this.darkMode ? 'dark' : 'light');
      document.documentElement.dataset.theme = this.darkMode ? THEME_DARK : THEME_LIGHT;
    }
  }
});
