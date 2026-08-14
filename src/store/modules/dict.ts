import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchGetDictAll } from '@/service/api/system/dict';
import { isSuccessResult } from '@/service/request';

/**
 * 数据字典 Store（参考 BaLauncher store/modules/dict）
 * 通过公共接口 /sysDict/public/allDict 一次性获取全部字典，无需登录
 */
export const useDictStore = defineStore('dict', () => {
  /** 全部字典项 Map（字典编码 → 子项列表），未加载时为 undefined */
  const dictItemMap = ref<Api.System.DictItemMap | undefined>(undefined);

  /** 是否已加载完成 */
  const loaded = computed(() => dictItemMap.value !== undefined);

  /** 初始化字典数据（幂等：已加载则跳过） */
  async function init(force = false) {
    if (dictItemMap.value !== undefined && !force) return;
    const res = await fetchGetDictAll();
    if (isSuccessResult(res)) {
      dictItemMap.value = res.data;
    }
  }

  /** 获取指定字典编码的子项数组 */
  function options(code: string): Api.System.DictOptions[] {
    return dictItemMap.value?.[code] ?? [];
  }

  /** 获取指定字典编码的 value → label 映射 */
  function map(code: string): Map<string, string> {
    return options(code).reduce((acc, item) => acc.set(item.value, item.label), new Map<string, string>());
  }

  /** 获取指定字典编码的 value → type 映射 */
  function type(code: string): Map<string, string> {
    return options(code).reduce((acc, item) => acc.set(item.value, item.type), new Map<string, string>());
  }

  return {
    dictItemMap,
    loaded,
    init,
    options,
    map,
    type
  };
});
