import type { App as VueApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import { APP_STORAGE_KEYS } from '@/constants/cache';
import zhCN from './lang/zh-CN';
import enUS from './lang/en-US';

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
};

const i18n = createI18n({
  legacy: false,
  locale: localStg.get(APP_STORAGE_KEYS.LANG) || 'zh-CN',
  fallbackLocale: 'en-US',
  messages
});

export { i18n };

/** 挂载 vue-i18n */
export function setupI18n(app: VueApp) {
  app.use(i18n);
}

/** 全局翻译函数（非组件环境使用） */
export const $t = i18n.global.t;

/** 切换界面语言并持久化 */
export function setLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale;
  localStg.set(APP_STORAGE_KEYS.LANG, locale);
}
