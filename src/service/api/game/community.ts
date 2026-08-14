import { request, type RequestResult } from '@/service/request';

/** 获取社区列表（/gameCommunity/list） */
export function fetchGetCommunityList(): Promise<RequestResult<Api.Game.GameCommunityVo[]>> {
  return request<Api.Game.GameCommunityVo[]>({
    url: '/gameCommunity/list',
    method: 'get'
  });
}
