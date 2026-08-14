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
    collapse: '收起侧边栏',
    expand: '展开侧边栏',
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
      downloadTitle: '下载 BaLauncher',
      downloadDesc: '支持 Windows / Linux / macOS 平台，选择适合你的系统版本即刻开始'
    },
    download: {
      windows: 'Windows 版',
      linux: 'Linux 版',
      mac: 'macOS 版',
      action: '立即下载',
      latest: '最新版本',
      unavailable: '暂未开放'
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
    }
  },
  server: {
    title: '服务器列表',
    empty: '暂无服务器数据，等待推送…',
    communityList: '社区',
    all: '全部',
    playerCount: '{count}人',
    offline: '离线',
    waiting: '等待服务器上线…',
    noTranslation: '暂无译名',
    unknownMode: '未分组',
    mode0: '僵尸逃跑',
    mode1: '娱乐模式',
    mode2: '闯关模式',
    mode3: 'PVE 模式',
    mode4: '生化模式',
    mode5: '挂机大厅',
    mode6: '僵尸逃跑CS2',
    modeFallback: '模式 {mode}',
    serverCount: '{count} 台服务器',
    serverName: '服务器名称',
    map: '地图',
    playerCountColumn: '人数',
    ping: 'Ping',
    score: '比分',
    mapRuntime: '换图时长',
    operate: '操作',
    joinServer: '加入服务器',
    autoJoin: '自动加入',
    copyAddr: '复制地址',
    copySuccess: '已复制到剪贴板',
    minutesAgo: '{count} 分钟前',
    wsConnecting: '连接中…',
    wsConnected: '实时推送中',
    wsDisconnected: '已断开',
    reconnect: '重新连接',
    viewCards: '卡片视图',
    viewTable: '表格视图',
    switchView: '切换视图',
    onlineCount: '在线 {count} 台',
    totalPlayers: '总玩家 {count} 人',
    card: {
      join: '加入',
      copy: '复制',
      auto: '自动加入'
    },
    mapPhase: {
      live: '进行中',
      warmup: '热身',
      halftime: '半场',
      over: '结束',
      pistolround: '手枪局',
      knife_round: '刀战局',
      bomb_planted: 'C4 已安放',
      bomb_defused: 'C4 已拆除'
    }
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
