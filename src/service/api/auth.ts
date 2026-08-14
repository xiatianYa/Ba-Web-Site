import { request, type RequestResult } from '@/service/request';

/**
 * OAuth 第三方登录（type 0=QQ 1=Steam）
 *
 * @param accessToken QQ access_token / Steam 传空字符串
 * @param openId QQ openid / Steam 17 位 SteamID
 * @param type 登录类型 0:QQ 1:Steam
 */
export function fetchOAuthLogin(
  accessToken: string,
  openId: string,
  type: Api.Auth.OAuthType
): Promise<RequestResult<Api.Auth.LoginToken>> {
  return request<Api.Auth.LoginToken>({
    url: '/auth/oauth2/login',
    method: 'post',
    data: { accessToken, openId, type }
  });
}

/** 获取当前登录用户信息 */
export function fetchGetUserInfo(): Promise<RequestResult<Api.Auth.UserInfo>> {
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
}

/** 退出登录 */
export function fetchLogout(): Promise<RequestResult<string>> {
  return request<string>({ url: '/auth/logout', method: 'post' });
}
