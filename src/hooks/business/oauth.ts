/**
 * 第三方登录（QQ / Steam）工具
 *
 * QQ 登录参考 JinLink-Web：使用 QQ 互联「隐式授权」（response_type=token）——
 * 授权成功后 access_token 直接回写在回调地址的 URL hash 中，无需后端换码；
 * 再用 JSONP（graph.qq.com/oauth2.0/me）换取 openid，全程规避浏览器跨域 CORS 限制。
 * 最终将 { accessToken, openId, type } 交给后端 /auth/oauth2/login 换取系统 Token。
 */

/** 弹窗与打开者之间 postMessage 的标识来源 */
export const OAUTH_MESSAGE_SOURCE = 'ba-launcher-oauth';

/** QQ 开放平台应用配置（与 BaLauncher / JinLink-Web 保持一致；隐式授权无需 client_secret） */
const QQ_CONFIG = {
  appId: '102129326',
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

/** 构造 QQ 授权 URL（隐式授权：token 回写在回调地址的 URL hash 中） */
export function getQqLoginUrl() {
  const params = new URLSearchParams({
    client_id: QQ_CONFIG.appId,
    redirect_uri: QQ_CONFIG.redirectUri,
    response_type: 'token',
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

interface QqMeCallbackPayload {
  openid?: string;
  error?: string;
  error_description?: string;
}

/** 用 access_token 通过 JSONP 获取 QQ openid
 * 注意：graph.qq.com 接口无 CORS 头，浏览器 XHR 会被拦截，需用 script 标签方式请求；
 * me 接口默认以 `callback({ "client_id":..., "openid":... })` 格式返回 */
function fetchQqOpenIdJsonp(accessToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const qcWindow = window as unknown as { callback?: (data: QqMeCallbackPayload) => void };
    const prevCallback = qcWindow.callback;
    const script = document.createElement('script');

    const cleanup = () => {
      script.remove();
      qcWindow.callback = prevCallback;
    };

    qcWindow.callback = (data: QqMeCallbackPayload) => {
      cleanup();
      if (data.error) {
        reject(new Error(`获取 QQ OpenID 失败: ${data.error_description || data.error}`));
      } else if (data.openid) {
        resolve(data.openid);
      } else {
        reject(new Error('QQ OpenID 为空'));
      }
    };

    script.src = `https://graph.qq.com/oauth2.0/me?access_token=${encodeURIComponent(accessToken)}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('获取 QQ OpenID 失败（网络错误）'));
    };
    document.head.appendChild(script);
  });
}

/**
 * 应用启动时调用：检测当前 URL 是否为 OAuth 回调页
 * - QQ：URL hash 携带 access_token（隐式授权）
 * - Steam：query 携带 openid.claimed_id
 * - 处理完成后通过 postMessage 回传登录参数给打开者（window.opener），随后关闭自身
 */
export function initOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const claimedId = params.get('openid.claimed_id');
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = hash.get('access_token');
  console.debug(
    '[OAuthCallback] 检测到回调 URL，query =',
    Object.fromEntries(params.entries()),
    'hash =',
    Object.fromEntries(hash.entries())
  );
  if (!accessToken && !claimedId) return;

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
      } else if (accessToken) {
        // QQ：直接用 hash 中的 access_token 换取 openid（JSONP，无跨域限制）
        const openid = await fetchQqOpenIdJsonp(accessToken);
        loginParams = { accessToken, openId: openid, type: 0 };
      } else {
        throw new Error('无效的回调参数');
      }

      report('success', { loginParams });
    } catch (error) {
      report('error', { message: (error as Error).message || '登录失败' });
    }
  })();
}
