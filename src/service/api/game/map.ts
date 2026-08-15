import { request, type RequestResult } from '@/service/request';

/** 获取地图游玩次数排行（/gameServerMapRecord/getMapPlayCountTop） */
export function fetchGetMapPlayCountList(params?: Api.Common.CommonSearchParams): Promise<RequestResult<Api.Game.GameMapPlayCountVo[]>> {
  return request<Api.Game.GameMapPlayCountVo[]>({
    url: '/gameServerMapRecord/getMapPlayCountTop',
    method: 'get',
    params
  });
}

/** 获取社区在线人数柱状图数据（/gameServerMapRecord/getCommunityOnlineBar） */
export function fetchGetCommunityOnlineBar(hours?: number): Promise<RequestResult<Api.Game.CommunityOnlineBarVo>> {
  return request<Api.Game.CommunityOnlineBarVo>({
    url: '/gameServerMapRecord/getCommunityOnlineBar',
    method: 'get',
    params: { hours }
  });
}
