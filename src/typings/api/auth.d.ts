declare namespace Api {
  namespace Auth {
    /** OAuth 登录类型：0=QQ，1=Steam */
    type OAuthType = 0 | 1;

    /** 登录令牌（后端 /auth/oauth2/login 返回） */
    interface LoginToken {
      accessToken: string;
      refreshToken: string;
    }

    /** 当前登录用户信息（后端 /auth/getUserInfo 返回） */
    interface UserInfo {
      id: string;
      userName: string;
      nickName: string;
      avatar: string;
      email: string;
      phone: string;
      qqOpenId?: string;
      steamOpenId?: string;
      roles: string[];
      buttons: string[];
    }
  }
}
