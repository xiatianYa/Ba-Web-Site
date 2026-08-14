import { useDictStore } from '@/store/modules/dict';

/**
 * 数据字典访问 Hook（参考 BaLauncher hooks/business/dict）
 *
 * @example
 *   const { dictLabel, dictType, dictOptions } = useDict();
 *   dictLabel('game_server_mode', String(server.mode)); // 模式文案
 */
export function useDict() {
  const dictStore = useDictStore();

  /** 获取指定字典编码的子项数组 */
  function dictOptions(code: string): Api.System.DictOptions[] {
    return dictStore.options(code);
  }

  /** 获取指定字典编码与值对应的标签文案 */
  function dictLabel(code: string, value: string): string {
    return dictStore.map(code).get(value) || '';
  }

  /** 获取指定字典编码与值对应的渲染类型（如 default/success/info/warning/error） */
  function dictType(code: string, value: string): string {
    return dictStore.type(code).get(value) || 'default';
  }

  return {
    dictOptions,
    dictLabel,
    dictType
  };
}
