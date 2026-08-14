import { request, type RequestResult } from '@/service/request';

/** 查询全部数据字典 Map（/sysDict/public/allDict，公共接口无需登录） */
export function fetchGetDictAll(): Promise<RequestResult<Api.System.DictItemMap>> {
  return request<Api.System.DictItemMap>({
    url: '/sysDict/public/allDict',
    method: 'get'
  });
}
