import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const OUTPUT_DIR = 'dist'

function write(file, content) {
  const path = join(OUTPUT_DIR, file)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

// The stylesheet is small, so each page carries it inline and preloads the font, saving round trips before the first paint.
function inlineStyles(html) {
  const link = /<link rel="stylesheet" crossorigin href="([^"]+)">/.exec(html)
  if (!link) throw new Error('index.html has no stylesheet link')
  const css = readFileSync(join(OUTPUT_DIR, link[1]), 'utf8')
  const fonts = [...css.matchAll(/url\((\/assets\/[^)]+\.woff2)\)/g)].map(([, href]) => href)
  const preloads = fonts.map((href) => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`)
  return html.replace(link[0], () => [...preloads, `<style>${css}</style>`].join(''))
}

const template = inlineStyles(readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf8'))
const LANG = '<html lang="es">'
const TITLE = '<title>Afinerdo</title>'
const ROOT = '<div id="root"></div>'

// A marker missing from index.html would otherwise ship pages without their language, head tags or prerendered app.
for (const marker of [LANG, TITLE, ROOT]) {
  if (!template.includes(marker)) throw new Error(`index.html has no ${marker}`)
}
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { pages, renderPage, rootPage, sitemap } = await vite.ssrLoadModule('/src/entry-server.tsx')

for (const { language, file } of pages) {
  const { app, head } = renderPage(language)
  write(
    file,
    template
      .replace(LANG, `<html lang="${language}">`)
      .replace(TITLE, () => head)
      .replace(ROOT, () => `<div id="root">${app}</div>`),
  )
}

write('index.html', rootPage())
write('sitemap.xml', sitemap())

await vite.close()
console.log(`${pages.length} pages prerendered to ${OUTPUT_DIR}`)
