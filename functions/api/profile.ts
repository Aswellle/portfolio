/// <reference types="@cloudflare/workers-types" />

// 与 stars/[owner]/[repo].ts 相同的同源代理链路（见该文件头部注释），用于"查看全部 N 个仓库"计数。
// 只统计非 fork 仓库：GET /users/{user}/repos 返回每个仓库的 fork 标记，filter 后计数。

const GH_USER = 'Aswellle';
const CACHE_TTL_SECONDS = 6 * 3600; // 仓库数量变化慢，缓存 6 小时

// DOM lib 与 workers-types 都声明了全局 CacheStorage（DOM 版无 .default 属性），
// 用结构类型桥接：运行时 caches 是 Workers 的 Cache API，default 即默认缓存命名空间
interface DefaultCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
const cache: DefaultCache = (caches as unknown as { default: DefaultCache }).default;

export const onRequest: PagesFunction = async ({ waitUntil }) => {
  const cacheKey = new Request(`https://api.github.com/users/${GH_USER}/repos?per_page=100`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const upstream = await fetch(cacheKey, {
    headers: {
      'User-Agent': 'aswellle-portfolio',
      Accept: 'application/vnd.github+json',
    },
  });

  let nonForkRepos: number | null = null;
  if (upstream.ok) {
    const repos = (await upstream.json()) as Array<{ fork: boolean }>;
    // per_page=100 已覆盖当前规模；若未来仓库数接近 100，需按 Link 头处理分页
    nonForkRepos = repos.filter((r) => !r.fork).length;
  }

  const body = JSON.stringify({ nonForkRepos, updatedAt: new Date().toISOString() });
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

  if (upstream.ok) {
    waitUntil(cache.put(cacheKey, response.clone()).catch(() => {}));
  } else {
    response.headers.set('Cache-Control', 'public, max-age=60');
  }

  return response;
};
