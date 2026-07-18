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
    description: 'Terminal AI coding agent for Chinese developers',
    longDesc: 'Open-source Claude Code-inspired terminal agent natively supporting 10 providers including Qwen, Doubao, GLM, and MiniMax. 42 tools, 20 slash commands, Vim mode, full Windows support.',
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
    description: 'Local-first photo manager with RAW & HEIC support',
    longDesc: 'Apple Photos-inspired desktop app. Handles 100k+ photos with virtualized rendering. Supports 16 RAW formats, HEIC, AVIF. Password-protected private albums, real-time folder watching.',
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
    description: 'Professional perler bead pattern designer — runs in your browser',
    longDesc: 'Web-based tool for Perler, Hama, and Artkal bead patterns. Features image-to-bead AI quantization with K-means++ in Lab color space, CIEDE2000 matching, and Floyd-Steinberg dithering.',
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
    description: 'Zero-friction clipboard translator for Windows',
    longDesc: 'Copy any text and a floating window appears near your cursor. 5 providers with auto-fallback chain, translation history in SQLite with FTS5, AES-256-GCM encrypted API keys, idle memory ≤ 50 MB.',
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
    description: 'Windows desktop app aggregating 17 AI image APIs',
    longDesc: 'Aggregates FLUX, DALL-E 3, Gemini, Stable Diffusion, Ideogram, Grok Aurora and more. Smart provider routing, batch generation, img2img, AI prompt optimization via DeepSeek V3. All data stays local.',
    tags: ['Python', 'Tkinter', 'AI', 'PyInstaller'],
    lang: 'Python',
    langColor: '#3572A5',
    stars: 2,
    githubUrl: 'https://github.com/Aswellle/2image',
  },
];
