export default {
  system: {
    title: 'BaLauncher'
  },
  routes: {
    home: '首页',
    server: '服务器',
    tools: '工具',
    setting: '设置'
  },
  common: {
    loading: '加载中...',
    cancel: '取消',
    confirm: '确认',
    placeholder: '占位页面，待补充内容',
    developing: '开发中，敬请期待'
  },
  nav: {
    toggleTheme: '切换主题',
    switchLanguage: '切换语言'
  },
  home: {
    badge: '碧蓝档案登录器',
    title: 'BaLauncher',
    description:
      '专为 CS2 社区服务器打造的桌面登录器：实时查询服务器状态、一键加入服务器、多社区集中管理与数据统计，一站式简化服务器管理。',
    downloadNow: '立即下载',
    viewServer: '查看服务器列表',
    navTitle: '常用导航',
    spotlightTitle: '热门推荐',
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
      unavailable: '暂未开放',
      badge: '官方出品',
      version: 'v2.1.4',
      size: '安装包约 100 MB',
      sysWin: '支持 Windows 7 及以上系统',
      sysLinux: '支持 Ubuntu 18.04 及以上系统',
      sysMac: '支持 macOS 11 及以上系统'
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
    dash: {
      currentOnline: '服务器当前在线',
      currentOnlineDesc: '接入服务器实时在线一览',
      communityRealtime: '社区实时在线',
      communityRealtimeDesc: '各社区实时在线人数与服务器数',
      historyOnline: '服务器历史在线',
      mapStats: '地图游玩统计',
      mapStatsDesc: '各地图游玩次数排行',
      playerStats: '在线玩家数量统计',
      playerStatsDesc: '平台实时在线规模一览',
      serversOnline: '在线服务器',
      playersOnline: '在线玩家',
      totalCommunities: '接入社区',
      mostOnline: '最多人在线',
      noData: '暂无数据',
      waitingWs: '等待实时数据接入…',
      totalOnline: '总在线人数',
      currentMap: '当前地图',
      onlinePlayers: '在线人数',
      timeRangeOneDay: '一天',
      timeRangeThreeDays: '三天',
      timeRangeOneWeek: '一周',
      onlineUser: '在线玩家',
      historyFetchFailed: '历史数据获取失败',
      mapPlayFetchFailed: '排行榜获取失败',
      playCount: '{count}次',
      playCountWan: '{count}万次',
      playCountK: '{count}k次'
    },
    preview: {
      title: '界面预览',
      desc: 'BaLauncher 实际运行界面展示',
      home: '首页',
      group: '群助手',
      keyBind: '按键绑定',
      mapOrder: '地图订阅',
      mapRecord: '服务器运行记录',
      perfView: '性能监测',
      serverList: '服务器列表',
      toolbox: '工具箱',
      prev: '上一张',
      next: '下一张'
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
    joinSuccess: '连接成功',
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
    },
    joinDialog: {
      joinWhen: '触发挤服人数',
      personCount: '{count} 人',
      joinDelay: '挤服延迟',
      delayMs: '{delay} ms',
      delayTip: '每次尝试加入的间隔时间，过短可能导致频繁重连',
      startJoin: '开始挤服',
      copiedTip: '已复制',
      autoJoining: '开始自动挤服，检测到空位后将自动连接服务器',
      autoJoiningTarget: '自动挤服中：{name}（在线 ≤ {count} 人可进）',
      wsError: 'WebSocket 未连接，自动挤服失败',
      autoJoinStopped: '已停止自动挤服'
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
    mouseStyle: '鼠标样式',
    mouseStyleDefault: '默认鼠标样式',
    mouseStyleDefaultDesc: '使用系统默认光标',
    mouseStyleAnimated: '动画鼠标样式',
    mouseStyleAnimatedDesc: '碧蓝档案风格点击与拖尾特效',
    language: '语言设置',
    languageDesc: '选择网站显示语言'
  },
  about: {
    title: '关于'
  },
  footer: {
    brand: '碧蓝档案登录器',
    techStack: 'Vue 3 · TypeScript · Vite · Pinia · Axios · daisyUI'
  },
  login: {
    title: '账号登录',
    desc: '登录后即可体验完整的社区服务',
    waiting: '等待授权窗口回传结果，请勿关闭本页面…',
    providerLabel: '选择登录方式',
    notLoggedIn: '未登录',
    userMenu: '用户菜单',
    logout: '退出登录',
    provider: {
      qq: 'QQ 登录',
      qqDesc: '使用 QQ 账号快速登录',
      steam: 'Steam 登录',
      steamDesc: '使用 Steam 账号快速登录'
    }
  },
  lang: {
    zhCN: '简体中文',
    enUS: 'English'
  }
};
