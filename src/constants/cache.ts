/** 应用设置存储键 */
export const APP_STORAGE_KEYS = {
  /** 主题名（daisyUI 主题名，如 ba-dark） */
  THEME: 'theme' as const,
  /** 主题方案（dark 深色 / light 浅色） */
  THEME_SCHEME: 'themeScheme' as const,
  /** 界面语言 */
  LANG: 'lang' as const,
  /** 服务器页视图模式（card 卡片 / table 表格） */
  SERVER_VIEW: 'serverView' as const,
  /** 侧边栏折叠状态 */
  SIDER_COLLAPSED: 'siderCollapsed' as const,
  /** 挤服配置（触发人数 + 挤服延迟） */
  GAME_JOIN_CONFIG: 'gameJoinConfig' as const
};

/** 认证存储键 */
export const AUTH_STORAGE_KEYS = {
  /** 登录令牌 */
  TOKEN: 'token' as const,
  /** 刷新令牌 */
  REFRESH_TOKEN: 'refreshToken' as const
};

/** 所有存储键的集合 */
export const ALL_STORAGE_KEYS = {
  ...APP_STORAGE_KEYS,
  ...AUTH_STORAGE_KEYS
};
