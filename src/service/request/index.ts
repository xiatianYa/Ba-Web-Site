import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios';
import { localStg } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/constants/cache';

/** 后端统一响应结构 */
export interface Response<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

/** 成功结果 */
export interface SuccessResult<T> {
  data: T;
  error: null;
  response: Response<T>;
}

/** 失败结果 */
export interface ErrorResult<T> {
  data: null;
  error: Error;
  response?: Response<T>;
}

export type RequestResult<T = unknown> = SuccessResult<T> | ErrorResult<T>;

/** 类型谓词：判断请求是否成功 */
export function isSuccessResult<T>(result: RequestResult<T>): result is SuccessResult<T> {
  return result.error === null;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  // 开发环境由 vite proxy 转发到后端
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// 请求拦截器：注入鉴权 Token（与 auth store 共用 localStg 持久化键）
instance.interceptors.request.use(
  (config) => {
    const token = localStg.get(AUTH_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 响应拦截器：统一错误处理（可按需扩展，如 401 跳转登录）
instance.interceptors.response.use(
  (response: AxiosResponse<Response>) => response,
  (error: AxiosError<Response>) => {
    return Promise.reject(error);
  }
);

/** 统一请求函数：解包后端 code/msg/data 结构 */
export function request<T>(config: AxiosRequestConfig): Promise<RequestResult<T>> {
  return new Promise((resolve) => {
    instance(config)
      .then((response: AxiosResponse<Response<T>>) => {
        if (response.data.code !== 200) {
          resolve({
            data: null,
            error: new Error(response.data.msg || 'Request failed'),
            response: response.data
          });
        } else {
          resolve({
            data: response.data.data,
            error: null,
            response: response.data
          });
        }
      })
      .catch((error: AxiosError<Response<T>>) => {
        resolve({
          data: null,
          error: new Error(error.message || '网络请求失败'),
          response: error.response?.data
        });
      });
  });
}

export default request;
