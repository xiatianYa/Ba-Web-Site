import { request, type RequestResult } from '@/service/request';

export * from './auth';
export * from './game/community';
export * from './system/dict';

/** 首页数据（示例） */
export interface HomeData {
  notice: string;
  banner: string;
}

/** 获取首页数据（示例接口，后端就绪后替换为真实地址） */
export function getHomeData(): Promise<RequestResult<HomeData>> {
  return request<HomeData>({
    url: '/home',
    method: 'get'
  });
}
