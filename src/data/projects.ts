export interface Project {
  id: string;
  name: string;
  nameZh?: string;
  description: string;
  longDesc: string;
  tags: string[];
  lang: string;
  langColor: string;
  stars: number;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  badge?: string;
}

export const projects: Project[] = [
  {
    id: 'qiling',
    name: 'QiLing',
    nameZh: '启灵',
    description: '面向中文开发者的终端 AI 编程代理',
    longDesc: '开源 Claude Code 复刻，原生支持通义千问、豆包、MiniMax、智谱 GLM 等 10 个国内外模型。内置 42 个工具、20 个斜杠命令，支持 Vim 模式、子代理协作与全平台（含 Windows .exe）。',
    tags: ['TypeScript', 'Bun', 'React', 'Ink', 'AI Agent'],
    lang: 'TypeScript',
    langColor: '#3178C6',
    stars: 1,
    githubUrl: 'https://github.com/Aswellle/QiLing-Agentic-Coding',
    featured: true,
    badge: 'Flagship',
  },
  {
    id: 'lightalbum',
    name: 'LightAlbum',
    description: '本地优先桌面照片管理器，支持 RAW 与 HEIC',
    longDesc: 'Apple Photos 风格的桌面应用，完全离线。支持 10 万张以上照片虚拟化渲染、16 种 RAW 格式（含 HEIC/AVIF），密码保护私人相册，实时文件夹监听自动同步，深色 / 浅色 / 系统主题。',
    tags: ['Tauri 2', 'Rust', 'React 19', 'Tailwind'],
    lang: 'Rust',
    langColor: '#CE422B',
    stars: 0,
    githubUrl: 'https://github.com/Aswellle/LightAblum',
    badge: 'New',
  },
  {
    id: 'pindou-studio',
    name: 'Pindou Studio',
    nameZh: '拼豆 Studio',
    description: '专业拼豆图纸 Web 设计工具，浏览器直接使用',
    longDesc: '支持 Perler、Hama、Artkal 三大品牌色板。核心亮点：图片转拼豆量化（Lab 色空间 K-means++、CIEDE2000 色差匹配、Floyd-Steinberg 抖动算法），Web Worker 保持界面流畅不卡顿，支持中英日韩四语言。',
    tags: ['React 18', 'Vite', 'Tailwind v4', 'Web Worker'],
    lang: 'JavaScript',
    langColor: '#F7DF1E',
    stars: 0,
    githubUrl: 'https://github.com/Aswellle/Pindou-Studio',
    liveUrl: 'https://pin-bead-studio.vercel.app',
    featured: true,
    badge: 'Live',
  },
  {
    id: 'quick-translate',
    name: 'quick-translate',
    description: 'Windows 零操作剪贴板翻译悬浮窗',
    longDesc: '复制任意文本，光标旁即弹出翻译悬浮窗，无需切换应用。内置 DeepL、腾讯、百度、有道、Google 五路自动降级，SQLite FTS5 翻译历史全文搜索，API 密钥 AES-256-GCM 加密存储，空闲内存 ≤50MB。',
    tags: ['Tauri 2', 'Rust', 'React 19', 'SQLite'],
    lang: 'Rust',
    langColor: '#CE422B',
    stars: 0,
    githubUrl: 'https://github.com/Aswellle/quick-translate',
  },
  {
    id: '2image',
    name: '2image',
    nameZh: '兔图',
    description: 'Windows 桌面 AI 绘图聚合工具，整合 17 个接口',
    longDesc: '聚合 FLUX、DALL-E 3、Gemini、Stable Diffusion、Ideogram、Grok Aurora 等 17 个免费与付费 API。智能路由自动择优，支持 img2img、批量生成（最多 6 张）、AI 提示词优化（基于 DeepSeek V3），所有数据本地存储。',
    tags: ['Python', 'Tkinter', 'AI', 'PyInstaller'],
    lang: 'Python',
    langColor: '#3572A5',
    stars: 2,
    githubUrl: 'https://github.com/Aswellle/2image',
  },
];
