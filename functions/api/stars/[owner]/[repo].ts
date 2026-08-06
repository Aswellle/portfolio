/// <reference types="@cloudflare/workers-types" />

// 星标数据实时获取的国内访问链路设计：
// 浏览器 → 同源 /api/*（Cloudflare Pages 边缘节点，与站点同一 CDN，国内延迟与页面加载一致）
//        → Cloudflare 边缘直连 api.github.com（边缘到 GitHub 毫秒级，且不受国内网络直连 GitHub 的不稳定影响）
// 若浏览器直连 api.github.com：国内直连延迟高、偶发丢包，故经同源 Pages Function 代理。
// 构建期 projects.ts 中的 stars 值保留为静态降级兜底（见 ProjectsSection.astro 中的客户端脚本）。

const CACHE_TTL_SECONDS = 3600; // 星标缓存 1 小时：兼顾"实时更新"与 GitHub 匿名 API 限流（60 次/小时/IP）
const UPSTREAM_BASE = 'https://api.github.com/repos';
const SEGMENT_RE = /^[A-Za-z0-9_.-]{1,100}$/;

// DOM lib 与 workers-types 都声明了全局 CacheStorage（DOM 版无 .default 属性），
// 用结构类型桥接：运行时 caches 是 Workers 的 Cache API，default 即默认缓存命名空间
interface DefaultCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
const cache: DefaultCache = (caches as unknown as { default: DefaultCache }).default;

export const onRequest: PagesFunction<{}, 'owner' | 'repo'> = async ({ params, waitUntil }) => {
  // 动态路径段在运行时总是单个字符串
  const { owner, repo } = params as { owner: string; repo: string };
  if (!SEGMENT_RE.test(owner) || !SEGMENT_RE.test(repo)) {
    return new Response(JSON.stringify({ stars: null, error: 'invalid repo path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  // 显式 Cache API 缓存：以 GitHub 上游 URL 为 key，命中则直接返回（不消耗上游配额）
  const cacheKey = new Request(`${UPSTREAM_BASE}/${owner}/${repo}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const upstream = await fetch(cacheKey, {
    headers: {
      'User-Agent': 'aswellle-portfolio', // GitHub API 要求 User-Agent
      Accept: 'application/vnd.github+json',
    },
  });

  let stars: number | null = null;
  if (upstream.ok) {
    const data = (await upstream.json()) as { stargazers_count?: number };
    stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  }

  const body = JSON.stringify({ stars, updatedAt: new Date().toISOString() });
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

  if (upstream.ok) {
    // 只有成功获取才写长缓存；失败（限流/网络）只保留 60 秒，避免长期展示错误数据
    waitUntil(cache.put(cacheKey, response.clone()).catch(() => {}));
  } else {
    response.headers.set('Cache-Control', 'public, max-age=60');
  }

  return response;
};
