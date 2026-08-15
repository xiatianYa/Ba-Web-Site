/**
 * CS2 服务器查询（type=114）请求-响应调度器
 *
 * 后端收到 { type: '114', data: '{"address":"ip:port","judgeCount":N}' } 后，
 * 会以 code=114 返回 { data: true/false } 作为该次查询的结果。
 * 由于是单连接串行查询（一次只发一条、等响应后再发下一条），
 * 这里维护一个全局「挂起的查询回调」，收到 114 响应时通知当前等待方。
 */

type QueryResolver = (result: boolean) => void;

let pendingResolver: QueryResolver | null = null;

/** 发起 114 查询前注册本次查询的响应回调 */
export function registerCs2QueryResolver(resolver: QueryResolver): void {
  pendingResolver = resolver;
}

/** 收到 code=114 响应时，通知当前挂起的查询并清除回调 */
export function notifyCs2QueryResult(result: boolean): void {
  const resolver = pendingResolver;
  pendingResolver = null;
  if (resolver) {
    resolver(result);
  }
}
