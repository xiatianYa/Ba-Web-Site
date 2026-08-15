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

/** 接口公共命名空间 */
declare namespace Api {
  namespace Common {
    /** 通用查询参数（分页） */
    type CommonSearchParams = {
      /** 当前页 */
      current?: number;
      /** 每页条数 */
      size?: number;
    };
  }
}
