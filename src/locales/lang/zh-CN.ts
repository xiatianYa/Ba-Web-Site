export default {
  system: {
    title: 'BaLauncher'
  },
  routes: {
    home: '首页',
    server: '服务器',
    tools: '工具',
    setting: '设置',
    about: '关于'
  },
  common: {
    loading: '加载中...',
    cancel: '取消',
    confirm: '确认',
    placeholder: '占位页面，待补充内容'
  },
  nav: {
    toggleMenu: '切换菜单',
    toggleTheme: '切换主题',
    switchLanguage: '切换语言'
  },
  home: {
    badge: 'Electron · Vue 3 · TypeScript · Vite · Naive UI',
    title: 'BaLauncher',
    description:
      '基于 Electron + Vue 3 + Vite 构建的 CS2 游戏服务器管理启动器，为社区服务器管理提供一站式解决方案。',
    learnMore: '了解功能',
    goServer: '前往服务器',
    section: {
      featuresTitle: '核心功能',
      featuresDesc: '为 CS2 社区服务器管理打造的桌面启动器，功能持续迭代中',
      techTitle: '技术栈',
      techDesc: '现代化桌面应用技术组合',
      testTitle: '请求链路验证',
      testDesc: '页面已接入封装好的 Axios 请求服务，点击下方按钮可验证整条请求链路是否畅通。',
      ctaTitle: '准备好开始了吗？',
      ctaDesc: '前往服务器列表查看实时状态，或在设置页自定义你的偏好。'
    },
    feature: {
      query: { title: '实时查询', desc: '实时查询服务器状态，在线人数、地图、延迟一目了然' },
      community: { title: '多社区列表', desc: '多社区服务器列表集中展示，快速切换管理目标' },
      join: { title: '一键加入', desc: '托盘一键挤服，快捷进入目标游戏服务器' },
      autoJoin: { title: '自动连接', desc: '到点自动连接目标服务器，省心省力' },
      copy: { title: '地址复制', desc: '服务器地址一键复制，方便分享给好友' },
      refresh: { title: '自动刷新', desc: '服务器状态自动刷新，时刻掌握最新动态' },
      auth: { title: '多端登录', desc: '支持 Steam / QQ 登录，快速进入个人中心' },
      stats: { title: '数据统计', desc: '服务器信息与比分数据可视化展示' }
    },
    testRequest: '测试接口请求',
    requesting: '请求中…',
    goSetting: '前往设置',
    requestFailed: '请求失败：{message}'
  },
  server: {
    title: '服务器列表'
  },
  tools: {
    title: '工具箱'
  },
  setting: {
    title: '设置',
    appearance: '外观设置',
    theme: '深色模式',
    themeDesc: '切换网站明暗主题',
    language: '语言设置',
    languageDesc: '选择网站显示语言'
  },
  about: {
    title: '关于'
  },
  footer: {
    brand: '碧蓝档案情报站',
    techStack: 'Vue 3 · TypeScript · Vite · Pinia · Axios · daisyUI'
  },
  lang: {
    zhCN: '简体中文',
    enUS: 'English'
  }
};
