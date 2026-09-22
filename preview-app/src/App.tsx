import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const GITHUB_PROFILE_URL = 'https://github.com/laura'

/** 顶部仿 GitHub 导航栏 */
function GhHeader() {
  return (
    <header className="flex items-center gap-4 bg-[#24292f] px-6 py-3 text-sm text-white">
      <GitHubIcon />
      <span>GitHub</span>
      <span className="font-semibold opacity-90">/ laura / laura</span>
    </header>
  )
}

function GitHubIcon() {
  return (
    <svg height="24" viewBox="0 0 16 16" width="24" className="fill-white">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  )
}

/** 个人信息 Banner */
function ProfileBanner() {
  return (
    <div className="flex items-center gap-4 border-b border-[#d1d9e0] bg-gradient-to-r from-[#f6f8fa] to-[#eef2f6] px-6 py-5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7F7FD5] via-[#86A8E7] to-[#91EAE4] text-2xl font-bold text-white">
        L
      </div>
      <div>
        <div className="text-xl font-bold">
          Laura <span className="font-normal text-[#59636e]">· laura</span>
        </div>
        <div className="mt-1 text-xs text-[#59636e]">
          本地预览（模拟 GitHub Profile 页）— 贪吃蛇动画需推送到 GitHub 后由 Actions 生成，本地无法显示
        </div>
      </div>
    </div>
  )
}

/** 本地预览限制提示 */
function LocalTip() {
  return (
    <div className="mx-auto my-6 max-w-[980px] rounded-lg border border-[#d4a72c] bg-[#fff8c5] px-4 py-3 text-[13px] text-[#4d2d00]">
      ⚠️ 提示：这是本地模拟预览。GitHub Stats、Streak、奖杯等统计图片在本地可以直接加载，但贪吃蛇 SVG
      需要仓库推送到 GitHub 并运行 Actions 后才会生成。
    </div>
  )
}

/** Markdown 渲染状态 */
type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; content: string }

/** 加载仓库根目录的 README.md */
function useReadme(): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    // BASE_URL 兼容 dev（/）与 GitHub Pages 子路径部署（如 /laura/）
    fetch(`${import.meta.env.BASE_URL}README.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((content) => {
        if (!cancelled) setState({ status: 'ok', content })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: `README.md 加载失败：${err instanceof Error ? err.message : String(err)}`,
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** README 渲染区域 */
function ReadmeView() {
  const state = useReadme()

  return (
    <article className="markdown-body mx-auto my-6 max-w-[980px] rounded-lg border border-[#d1d9e0] bg-white px-12 py-8 text-[#1f2328]">
      {state.status === 'loading' && <p className="text-[#59636e]">加载中…</p>}
      {state.status === 'error' && (
        <p className="text-[#cf222e]">
          {state.message}（请确认通过 dev server 访问，而不是直接打开静态文件）
        </p>
      )}
      {state.status === 'ok' && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          urlTransform={(url) => url}
        >
          {state.content}
        </ReactMarkdown>
      )}
    </article>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f2f4f8] font-sans text-[#1f2328] antialiased">
      <GhHeader />
      <ProfileBanner />
      <LocalTip />
      <ReadmeView />
    </div>
  )
}

// 保留导出，便于外部引用主页地址
export { GITHUB_PROFILE_URL }
