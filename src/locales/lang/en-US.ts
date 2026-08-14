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
      testTitle: 'Request Pipeline',
      testDesc:
        'The page is wired up with the wrapped Axios request service. Click the button below to verify the whole request pipeline.',
      ctaTitle: 'Ready to get started?',
      ctaDesc: 'Head to the server list to check live status, or customize your preferences in Settings.'
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
    testRequest: 'Test request',
    requesting: 'Requesting…',
    goSetting: 'Go to Settings',
    requestFailed: 'Request failed: {message}'
  },
  server: {
    title: 'Server List'
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
