import axios from 'axios';

/** 弹窗与打开者之间 postMessage 的标识来源 */
export const OAUTH_MESSAGE_SOURCE = 'ba-launcher-oauth';

/** QQ 开放平台应用配置（与 BaLauncher 保持一致） */
const QQ_CONFIG = {
  appId: '102129326',
  clientSecret: 'GVYMwHNGuRFrEMFt',
  redirectUri: 'https://www.bluearchive.top/main'
};

/** Steam OpenID 配置 */
const STEAM_CONFIG = {
  realm: 'https://www.bluearchive.top',
  returnTo: 'https://www.bluearchive.top/main'
};

/** 生成随机 state（防 CSRF） */
function generateState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/** 构造 QQ 授权 URL（authorization_code 模式） */
export function getQqLoginUrl() {
  const params = new URLSearchParams({
    client_id: QQ_CONFIG.appId,
    redirect_uri: QQ_CONFIG.redirectUri,
    response_type: 'code',
    scope: 'get_user_info',
    state: generateState()
  });
  return `https://graph.qq.com/oauth2.0/authorize?${params.toString()}`;
}

/** 构造 Steam OpenID 授权 URL */
export function getSteamLoginUrl() {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': STEAM_CONFIG.returnTo,
    'openid.realm': STEAM_CONFIG.realm,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
  });
  return `https://steamcommunity.com/openid/login?${params.toString()}`;
}

/** 用授权码 code 换取 QQ access_token（响应为表单字符串）
 * 注意：graph.qq.com 接口无 CORS 头，浏览器端会被拦截，需后端代理完成（BaLauncher 在 Electron 主进程完成） */
async function exchangeQqToken(code: string) {
  try {
    const res = await axios.get<string>('https://graph.qq.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: QQ_CONFIG.appId,
        client_secret: QQ_CONFIG.clientSecret,
        code,
        redirect_uri: QQ_CONFIG.redirectUri
      }
    });
    const data = new URLSearchParams(res.data);
    if (data.get('error')) {
      throw new Error(`获取 QQ Token 失败: ${data.get('error_description') || data.get('error')}`);
    }
    return {
      accessToken: data.get('access_token') ?? '',
      refreshToken: data.get('refresh_token') ?? ''
    };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('获取 QQ Token 失败')) {
      throw error;
    }
    throw new Error(
      `QQ 登录需要在后端完成 code→token 交换（浏览器跨域 CORS 限制），请联系后端提供回调代理接口。原始错误: ${(error as Error).message}`
    );
  }
}

/** 用 access_token 换取 QQ openid（返回 JSONP 格式，需剥离 callback 包裹） */
async function fetchQqOpenId(accessToken: string) {
  const res = await axios.get<string>('https://graph.qq.com/oauth2.0/me', {
    params: { access_token: accessToken }
  });
  const json = res.data.replace(/^callback\(/, '').replace(/\);?$/, '');
  const data = JSON.parse(json) as { openid?: string; error?: string; error_description?: string };
  if (data.error) {
    throw new Error(`获取 QQ OpenID 失败: ${data.error_description || data.error}`);
  }
  if (!data.openid) {
    throw new Error('QQ OpenID 为空');
  }
  return data.openid;
}

/**
 * 应用启动时调用：检测当前 URL 是否为 OAuth 回调页
 * - QQ：query 带 code；Steam：query 带 openid.claimed_id
 * - 处理完成后通过 postMessage 回传登录参数给打开者（window.opener），随后关闭自身
 */
export function initOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const claimedId = params.get('openid.claimed_id');
  console.debug('[OAuthCallback] 检测到回调 URL，query =', Object.fromEntries(params.entries()));
  if (!code && !claimedId) return;

  const report = (type: 'success' | 'error', payload: Record<string, unknown>) => {
    const message = { source: OAUTH_MESSAGE_SOURCE, type, ...payload };
    if (window.opener) {
      // targetOrigin 用 '*'：弹窗回跳域名(生产)与打开者(开发 localhost)可能不同源，
      // 接收端通过 source 标识 + 参数结构校验来确保数据可信
      window.opener.postMessage(message, '*');
      console.debug('[OAuthCallback] 已向 opener 回传', type, payload);
      window.close();
    } else {
      console.debug('[OAuthCallback] 无 opener（直接访问回调页），跳过回传', message);
    }
  };

  void (async () => {
    try {
      let loginParams: { accessToken: string; openId: string; type: 0 | 1 };

      if (claimedId) {
        // Steam OpenID：从 claimed_id 中提取 17 位 SteamID
        const steamIdMatch = claimedId.match(/\/id\/(\d+)/);
        if (!steamIdMatch) throw new Error('无法解析 Steam ID');
        loginParams = { accessToken: '', openId: steamIdMatch[1], type: 1 };
      } else if (code) {
        // QQ：code → access_token → openid
        const token = await exchangeQqToken(code);
        const openid = await fetchQqOpenId(token.accessToken);
        loginParams = { accessToken: token.accessToken, openId: openid, type: 0 };
      } else {
        throw new Error('无效的回调参数');
      }

      report('success', { loginParams });
    } catch (error) {
      report('error', { message: (error as Error).message || '登录失败' });
    }
  })();
}
