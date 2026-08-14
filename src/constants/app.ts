/** 应用基础信息 */
export const APP_NAME = 'BaLauncher';

export const APP_DESC = '蔚蓝档案登录器';

/** 站点支持的语言选项（labelKey 对应 locales 中的翻译键） */
export const LANG_OPTIONS: Array<{ value: App.I18n.LangType; labelKey: App.I18n.I18nKey }> = [
  { value: 'zh-CN', labelKey: 'lang.zhCN' },
  { value: 'en-US', labelKey: 'lang.enUS' }
];
