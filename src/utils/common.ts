import dayjs from 'dayjs';
import { klona } from 'klona';
import { twMerge } from 'tailwind-merge';

/** 合并 Tailwind 类名（自动去重冲突样式） */
export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(' '));
}

/** 格式化日期 */
export function formatDate(date: string | number | Date, template = 'YYYY-MM-DD') {
  return dayjs(date).format(template);
}

/** 深拷贝 */
export function deepClone<T>(value: T): T {
  return klona(value);
}
