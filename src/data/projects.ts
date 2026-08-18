export type Badge = 'Live' | 'Flagship' | 'New';

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
  badges?: Badge[];
}

export const projects: Project[] = [
  {
    id: 'pindou-studio',
    name: 'Pindou Studio',
    nameZh: '拼豆 Studio',
    description: '在线拼豆图纸设计工具，手机电脑打开即用',
    longDesc: '从网格手绘到图片一键转图纸的完整工具链：K-means++ 取色 + CIEDE2000 色彩匹配，Perler、Hama、Artkal 三大品牌共 236 个色号。图纸导出 PNG/SVG 附色号清单与用量统计，3 倍超采样打印放大不糊。内置 18 篇拼豆教程，移动端支持双指缩放绘制，中英日韩四语言。',
    tags: ['React 18', 'Vite', 'Tailwind v4', 'Web Worker'],
    lang: 'JavaScript',
    langColor: '#F7DF1E',
    stars: 3,
    githubUrl: 'https://github.com/Aswellle/Pindou-Studio',
    liveUrl: 'https://tangnotes.site',
    featured: true,
    badges: ['Live', 'Flagship'],
  },
  {
    id: '2image',
    name: '2image',
    nameZh: '兔图',
    description: 'Windows 桌面 AI 绘图工具，内置 22 个生图服务',
    longDesc: '不注册任何账号也能直接出图（Pollinations 开箱即用），覆盖 FLUX、Gemini、通义万相、GPT-Image、硅基流动等 22 个免费与付费服务。智能路由按场景自动排序接口，支持图生图、一次 6 张批量变体、顺序队列挂机生成，中文描述自动翻译成提示词，所有数据只存本地。',
    tags: ['Python', 'Tkinter', 'AI', 'PyInstaller'],
    lang: 'Python',
    langColor: '#3572A5',
    stars: 2,
    githubUrl: 'https://github.com/Aswellle/2image',
  },
  {
    id: 'quick-translate',
    name: 'quick-translate',
    description: 'Windows 复制即翻译悬浮窗，任意应用可用',
    longDesc: '在任意应用里复制一段文本，翻译浮窗立刻出现在光标旁——读文档、看论文、回外文邮件全程不用切窗口。DeepL、腾讯、百度、有道、Google 五路自动降级，翻译历史可搜索收藏，密钥 AES-256-GCM 加密存储，支持后台静默自动更新，安装包仅 5MB、空闲内存 ≤50MB。',
    tags: ['Tauri 2', 'Rust', 'React 19', 'SQLite'],
    lang: 'Rust',
    langColor: '#CE422B',
    stars: 0,
    githubUrl: 'https://github.com/Aswellle/quick-translate',
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
    githubUrl: 'https://github.com/Aswellle/LightAlbum',
    badges: ['New'],
  },
  {
    id: 'remotebridge',
    name: 'RemoteBridge',
    description: '无需端口转发的跨网络远程文件访问工具',
    longDesc: '中继服务器架构：Electron 桌面应用（Host）向公网中继发起出站 WebSocket 连接，浏览器通过 PIN 码配对后即可浏览和下载本机文件。零防火墙配置、白名单路径隔离、httpOnly Cookie 防 XSS、一次性下载令牌，支持 Docker 自托管中继服务器。',
    tags: ['Electron', 'Next.js 14', 'Fastify', 'WebSocket', 'Turborepo'],
    lang: 'TypeScript',
    langColor: '#3178C6',
    stars: 0,
    githubUrl: 'https://github.com/Aswellle/RemoteBridge',
  },
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
    badges: ['Flagship'],
  },
];
