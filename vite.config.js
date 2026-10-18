import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Политика безопасности для публикации (GitHub Pages не даёт задавать HTTP-заголовки,
// поэтому она встраивается в страницу). Разрешено только своё: скрипты, стили, шрифты, картинки.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // inline-стили React (style={{…}})
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = () => ({
  name: 'security-meta',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
    { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
  ],
})

// base: './' — сайт работает из любой подпапки GitHub Pages.
// SECURE=1 — сборка для публикации со встроенной политикой безопасности.
export default defineConfig({
  plugins: [react(), process.env.SECURE === '1' && securityHeaders()],
  base: './',
})
