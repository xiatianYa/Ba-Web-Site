declare namespace Api {
  namespace System {
    /** 数据字典子项（对应 SysDictItemOptionsVo：label/value/type/sort） */
    interface DictOptions {
      /** 显示的值 */
      label: string;
      /** 实际值 */
      value: string;
      /** 类型（前端渲染类型，如 default/success/info/warning/error） */
      type: string;
      /** 排序 */
      sort: number;
    }

    /** 全部字典 Map（字典编码 → 字典子项列表） */
    type DictItemMap = Record<string, Api.System.DictOptions[]>;
  }
}
