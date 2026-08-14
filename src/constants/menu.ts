/** 导航菜单项 */
export interface NavMenuItem {
  name: string;
  path: string;
  /** 标题翻译键（对应 locales 中的 routes.*） */
  titleKey: App.I18n.I18nKey;
  /** 图标（对应 plugins/icons.ts 中注册的图标） */
  icon: string;
}

/** 站点导航菜单（新增页面时在此追加） */
export const NAV_MENUS: NavMenuItem[] = [
  { name: 'home', path: '/', titleKey: 'routes.home', icon: 'heroicons:home' },
  { name: 'server', path: '/server', titleKey: 'routes.server', icon: 'heroicons:server-stack' },
  { name: 'tools', path: '/tools', titleKey: 'routes.tools', icon: 'heroicons:wrench-screwdriver' },
  { name: 'setting', path: '/setting', titleKey: 'routes.setting', icon: 'heroicons:cog-6-tooth' }
];

/** 判断菜单项是否处于激活态（/ 精确匹配，其余按前缀匹配） */
export function isMenuActive(path: string, routePath: string): boolean {
  return path === '/' ? routePath === '/' : routePath.startsWith(path);
}
