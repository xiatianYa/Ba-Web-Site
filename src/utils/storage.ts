/** 存储类型 */
export type StorageType = 'local' | 'session';

const storagePrefix = 'BA_';

/** 创建带前缀与 JSON 序列化的存储对象 */
export function createStorage<T extends object>(type: StorageType, prefix: string) {
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  return {
    /** 设置值 */
    set<K extends keyof T>(key: K, value: T[K]) {
      stg.setItem(`${prefix}${key as string}`, JSON.stringify(value));
    },
    /** 获取值，不存在或解析失败时返回 null */
    get<K extends keyof T>(key: K): T[K] | null {
      const json = stg.getItem(`${prefix}${key as string}`);
      if (!json) return null;

      try {
        const data = JSON.parse(json);
        if (data !== null && data !== undefined) return data as T[K];
      } catch {
        // 解析失败视为无效数据
      }

      stg.removeItem(`${prefix}${key as string}`);
      return null;
    },
    /** 移除值 */
    remove(key: keyof T) {
      stg.removeItem(`${prefix}${key as string}`);
    },
    /** 清空所有 */
    clear() {
      stg.clear();
    }
  };
}

export const localStg = createStorage<StorageType.Local>('local', storagePrefix);
