/** 本地存储结构 */
declare namespace StorageType {
  interface Local {
    /** 界面语言 */
    lang: App.I18n.LangType;
    /** 主题名（daisyUI 主题名） */
    theme: string;
    /** 主题方案（dark / light） */
    themeScheme: 'dark' | 'light';
    /** 登录令牌 */
    token: string;
    /** 刷新令牌 */
    refreshToken: string;
  }
}
