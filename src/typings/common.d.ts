/** 公共类型命名空间 */
declare namespace CommonType {
  /** 选项类型 */
  type Option<K = string, M = string> = { value: K; label: M };

  type YesOrNo = 'Y' | 'N';

  /** 所有属性可为 null 的版本 */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };
}
