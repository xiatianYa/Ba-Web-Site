import { defineStore } from 'pinia';
import { localStg } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/constants/cache';
import { fetchGetUserInfo, fetchLogout, fetchOAuthLogin } from '@/service/api/auth';
import { isSuccessResult } from '@/service/request';

/** 认证状态：token 持久化 + 用户信息 + 登录弹窗显隐 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: (localStg.get(AUTH_STORAGE_KEYS.TOKEN) ?? '') as string,
    refreshToken: (localStg.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ?? '') as string,
    userInfo: null as Api.Auth.UserInfo | null,
    /** 登录弹窗显隐 */
    loginModalVisible: false
  }),
  getters: {
    isLogin: state => Boolean(state.accessToken)
  },
  actions: {
    openLoginModal() {
      this.loginModalVisible = true;
    },
    closeLoginModal() {
      this.loginModalVisible = false;
    },

    /** 保存登录令牌并持久化 */
    setToken(data: Api.Auth.LoginToken) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      localStg.set(AUTH_STORAGE_KEYS.TOKEN, data.accessToken);
      localStg.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    },

    /** 清空登录态（本地令牌 + 用户信息） */
    clearAuth() {
      this.accessToken = '';
      this.refreshToken = '';
      this.userInfo = null;
      localStg.remove(AUTH_STORAGE_KEYS.TOKEN);
      localStg.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * OAuth 登录（type 0=QQ 1=Steam）
     * 成功后将令牌写入状态与本地存储，并拉取用户信息
     */
    async oAuthLogin(params: { accessToken: string; openId: string; type: Api.Auth.OAuthType }) {
      const res = await fetchOAuthLogin(params.accessToken, params.openId, params.type);
      if (isSuccessResult(res)) {
        this.setToken(res.data);
        await this.getUserInfo();
        this.closeLoginModal();
        return res.data;
      }
      throw new Error(res.error.message || '登录失败');
    },

    /** 拉取当前登录用户信息 */
    async getUserInfo() {
      if (!this.isLogin) return;
      const res = await fetchGetUserInfo();
      if (isSuccessResult(res)) {
        this.userInfo = res.data;
      }
    },

    /** 退出登录 */
    async logout() {
      if (this.isLogin) {
        await fetchLogout();
      }
      this.clearAuth();
    }
  }
});
