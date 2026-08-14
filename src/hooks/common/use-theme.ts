import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/modules/app';

/** 主题 Hook：解构出响应式的暗色状态与切换方法 */
export function useTheme() {
  const appStore = useAppStore();
  const { darkMode } = storeToRefs(appStore);
  const toggleDarkMode = () => appStore.toggleDarkMode();

  return { darkMode, toggleDarkMode };
}
