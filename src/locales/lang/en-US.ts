export default {
  system: {
    title: 'BaLauncher'
  },
  routes: {
    home: 'Home',
    server: 'Servers',
    tools: 'Tools',
    setting: 'Settings'
  },
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    placeholder: 'Placeholder page, content pending',
    developing: 'Under development, stay tuned'
  },
  nav: {
    toggleTheme: 'Toggle theme',
    switchLanguage: 'Switch language'
  },
  home: {
    badge: 'Blue Archive · Official Launcher',
    title: 'BaLauncher',
    description:
      'A desktop launcher built for CS2 community servers: real-time server status, one-click join, multi-community management and data stats — all in one place.',
    downloadNow: 'Download Now',
    viewServer: 'View Server List',
    navTitle: 'Quick Navigation',
    spotlightTitle: 'Highlights',
    section: {
      featuresTitle: 'Core Features',
      featuresDesc: 'A desktop launcher crafted for CS2 community server management, continuously evolving',
      techTitle: 'Tech Stack',
      techDesc: 'Modern desktop application technology stack',
      downloadTitle: 'Download BaLauncher',
      downloadDesc: 'Available on Windows, Linux and macOS — pick your platform and get started'
    },
    download: {
      windows: 'Windows',
      linux: 'Linux',
      mac: 'macOS',
      action: 'Download Now',
      latest: 'Latest version',
      unavailable: 'Coming soon',
      badge: 'Official',
      version: 'v2.0.3',
      size: '~85 MB installer',
      sysWin: 'Windows 7 and above',
      sysLinux: 'Ubuntu 18.04 and above',
      sysMac: 'macOS 11 and above'
    },
    feature: {
      query: { title: 'Live Query', desc: 'Query CS2 server status in real time — players, map and latency at a glance' },
      community: { title: 'Multi-Community', desc: 'Community server lists in one place for quick switching' },
      join: { title: 'One-Click Join', desc: 'Join the target server quickly from the system tray' },
      autoJoin: { title: 'Auto Join', desc: 'Auto-connect to target servers on schedule, hands-free' },
      copy: { title: 'Address Copy', desc: 'Copy server addresses with one click to share with friends' },
      refresh: { title: 'Auto Refresh', desc: 'Server status auto-refreshes to stay up to date' },
      auth: { title: 'Multi-Auth', desc: 'Sign in with Steam / QQ accounts' },
      stats: { title: 'Data Stats', desc: 'Visualize server info and match score data' }
    },
    dash: {
      currentOnline: 'Servers Online Now',
      currentOnlineDesc: 'Live view of connected servers',
      communityRealtime: 'Community Live',
      communityRealtimeDesc: 'Live players & servers per community',
      historyOnline: 'Server Online History',
      mapStats: 'Map Play Stats',
      mapStatsDesc: 'Map play count ranking',
      playerStats: 'Online Players',
      playerStatsDesc: 'Live platform scale at a glance',
      serversOnline: 'Online Servers',
      playersOnline: 'Online Players',
      totalCommunities: 'Communities',
      mostOnline: 'Most Players',
      noData: 'No data',
      waitingWs: 'Waiting for live data…',
      totalOnline: 'Total Online',
      currentMap: 'Map',
      onlinePlayers: 'Players',
      timeRangeOneDay: '1 day',
      timeRangeThreeDays: '3 days',
      timeRangeOneWeek: '1 week',
      onlineUser: 'Online Users',
      historyFetchFailed: 'Failed to load history data',
      mapPlayFetchFailed: 'Failed to load ranking',
      playCount: '{count} plays',
      playCountWan: '{count}w plays',
      playCountK: '{count}k plays'
    },
    preview: {
      title: 'UI Preview',
      desc: 'BaLauncher UI showcase',
      home: 'Home',
      group: 'Group Bot',
      keyBind: 'Key Bindings',
      mapOrder: 'Map Subscribe',
      mapRecord: 'Server Records',
      perfView: 'Performance Monitor',
      serverList: 'Server List',
      toolbox: 'Toolbox',
      prev: 'Previous',
      next: 'Next'
    }
  },
  server: {
    title: 'Server List',
    empty: 'No server data yet, waiting for pushes…',
    communityList: 'Communities',
    all: 'All',
    playerCount: '{count} player | {count} players',
    offline: 'Offline',
    waiting: 'Waiting for the server to come online…',
    noTranslation: 'No translation',
    unknownMode: 'Uncategorized',
    mode0: 'Zombie Escape',
    mode1: 'Casual',
    mode2: 'Course',
    mode3: 'PVE',
    mode4: 'Infection',
    mode5: 'Idle Lobby',
    mode6: 'Zombie Escape CS2',
    modeFallback: 'Mode {mode}',
    serverCount: '{count} server | {count} servers',
    serverName: 'Server Name',
    map: 'Map',
    playerCountColumn: 'Players',
    ping: 'Ping',
    score: 'Score',
    mapRuntime: 'Map Runtime',
    operate: 'Actions',
    joinServer: 'Join server',
    autoJoin: 'Auto join',
    copyAddr: 'Copy address',
    copySuccess: 'Copied to clipboard',
    joinSuccess: 'Connection success',
    minutesAgo: '{count} minutes ago',
    wsConnecting: 'Connecting…',
    wsConnected: 'Live',
    wsDisconnected: 'Disconnected',
    reconnect: 'Reconnect',
    viewCards: 'Card view',
    viewTable: 'Table view',
    switchView: 'Switch view',
    onlineCount: '{count} online',
    totalPlayers: '{count} players',
    card: {
      join: 'Join',
      copy: 'Copy',
      auto: 'Auto'
    },
    mapPhase: {
      live: 'Live',
      warmup: 'Warmup',
      halftime: 'Halftime',
      over: 'Over',
      pistolround: 'Pistol round',
      knife_round: 'Knife round',
      bomb_planted: 'Bomb planted',
      bomb_defused: 'Bomb defused'
    },
    joinDialog: {
      joinWhen: 'Join when players reach',
      personCount: '{count} players',
      joinDelay: 'Join delay',
      delayMs: '{delay} ms',
      delayTip: 'Interval between join attempts; too short may cause frequent reconnects',
      startJoin: 'Start joining',
      copiedTip: 'Copied',
      autoJoining: 'Auto join started; the server will connect once a slot is found',
      autoJoiningTarget: 'Auto joining: {name} (joinable when ≤ {count} players)',
      wsError: 'WebSocket disconnected, auto join failed',
      autoJoinStopped: 'Auto join stopped'
    }
  },
  tools: {
    title: 'Toolbox'
  },
  setting: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Dark mode',
    themeDesc: 'Toggle light/dark theme',
    mouseStyle: 'Mouse style',
    mouseStyleDefault: 'Default cursor',
    mouseStyleDefaultDesc: 'Use the system default cursor',
    mouseStyleAnimated: 'Animated cursor',
    mouseStyleAnimatedDesc: 'Blue Archive style click & trail effect',
    language: 'Language',
    languageDesc: 'Select display language'
  },
  about: {
    title: 'About'
  },
  footer: {
    brand: 'Blue Archive Launcher',
    techStack: 'Vue 3 · TypeScript · Vite · Pinia · Axios · daisyUI'
  },
  login: {
    title: 'Sign in',
    desc: 'Sign in to unlock the full community experience',
    waiting: 'Waiting for the auth window to respond, please keep this page open…',
    providerLabel: 'Choose a sign-in method',
    notLoggedIn: 'Not signed in',
    userMenu: 'User menu',
    logout: 'Sign out',
    provider: {
      qq: 'QQ',
      qqDesc: 'Sign in quickly with your QQ account',
      steam: 'Steam',
      steamDesc: 'Sign in quickly with your Steam account'
    }
  },
  lang: {
    zhCN: '简体中文',
    enUS: 'English'
  }
};
