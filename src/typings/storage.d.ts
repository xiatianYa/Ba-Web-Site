/** 本地存储结构 */
declare namespace StorageType {
  interface Local {
    /** 界面语言 */
    lang: App.I18n.LangType;
    /** 主题名（daisyUI 主题名） */
    theme: string;
    /** 主题方案（dark / light） */
    themeScheme: 'dark' | 'light';
    /** 服务器页视图模式（card / table） */
    serverView: 'card' | 'table';
    /** 挤服配置（触发人数 + 挤服延迟） */
    gameJoinConfig: {
      joinPerson: number;
      joinDelay: number;
    };
    /** 登录令牌 */
    token: string;
    /** 刷新令牌 */
    refreshToken: string;
  }
}
