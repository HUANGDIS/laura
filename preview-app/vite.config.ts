import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'

const README_PATH = path.resolve(import.meta.dirname, '../README.md')

/**
 * README 插件：
 * - dev：中间件把仓库根目录的 README.md 提供在 /README.md
 * - build：把 README.md 一起打进 dist 产物
 */
function readmePlugin(): Plugin {
  return {
    name: 'readme-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === '/README.md') {
          try {
            const content = readFileSync(README_PATH, 'utf-8')
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
            res.end(content)
          } catch {
            res.statusCode = 404
            res.end('README.md not found')
          }
        } else {
          next()
        }
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'README.md',
        source: readFileSync(README_PATH, 'utf-8'),
      })
    },
  }
}

// https://vite.dev/config/
// GitHub Pages 仓库站点部署在 https://<user>.github.io/<repo>/ 子路径下，
// 通过环境变量 VITE_BASE 指定，例如 /laura/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), readmePlugin()],
})
