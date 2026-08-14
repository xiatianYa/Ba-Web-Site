export default {
  system: {
    title: 'BaLauncher'
  },
  routes: {
    home: 'Home',
    server: 'Server',
    tools: 'Tools',
    setting: 'Settings',
    about: 'About'
  },
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    placeholder: 'Placeholder page, content pending'
  },
  nav: {
    toggleMenu: 'Toggle menu',
    toggleTheme: 'Toggle theme',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    switchLanguage: 'Switch language'
  },
  home: {
    badge: 'Electron · Vue 3 · TypeScript · Vite · Naive UI',
    title: 'BaLauncher',
    description:
      'A CS2 game server management launcher built with Electron + Vue 3 + Vite, providing a one-stop solution for community server management.',
    learnMore: 'Learn more',
    goServer: 'Go to Server',
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
      unavailable: 'Coming soon'
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
      halftime: 'Half-time',
      over: 'Over',
      pistolround: 'Pistol round',
      knife_round: 'Knife round',
      bomb_planted: 'Bomb planted',
      bomb_defused: 'Bomb defused'
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
    language: 'Language',
    languageDesc: 'Select display language'
  },
  about: {
    title: 'About'
  },
  footer: {
    brand: 'Blue Archive Info Site',
    techStack: 'Vue 3 · TypeScript · Vite · Pinia · Axios · daisyUI'
  },
  lang: {
    zhCN: '简体中文',
    enUS: 'English'
  }
};
