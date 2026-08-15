declare namespace Api {
  namespace Auth {
    /** OAuth 登录类型：0=QQ，1=Steam */
    type OAuthType = 0 | 1;

    /** 登录令牌（后端 /auth/oauth2/login 返回，字段名为 token） */
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    /** 当前登录用户信息（后端 /auth/getUserInfo 返回 SysUserInfoVo） */
    interface UserInfo {
      id: string;
      userId: string;
      /** 昵称（后端 SysUserInfoVo 将其映射到 userName 字段） */
      userName: string;
      avatar: string;
      roles: string[];
      buttons: string[];
    }
  }
}
