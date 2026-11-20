import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { Head, OpenGraph } from './Head.tsx'
import { LANGUAGES, LanguageProvider, stringsFor, type Language } from './i18n.ts'
import { alternates, pageMeta, pageUrl, ROOT_URL } from './seo.ts'

export const pages = LANGUAGES.map((language) => ({ language, file: `${language}/index.html` }))

export const renderPage = (language: Language) => ({
  app: renderToString(
    <LanguageProvider value={language}>
      <App />
    </LanguageProvider>,
  ),
  head: renderToStaticMarkup(<Head language={language} />),
})

const alternateLinks = alternates
  .map(({ hrefLang, href }) => `<link rel="alternate" hreflang="${hrefLang}" href="${href}" />`)
  .join('\n    ')

// The first supported language among the system's, or else English.
// Capacitor answers any path without an extension with this root page, so the Android app asks for the file itself.
const redirect = `const supported = ${JSON.stringify(LANGUAGES)}
      const language = navigator.languages.map((tag) => tag.split('-')[0].toLowerCase()).find((code) => supported.includes(code))
      const file = window.Capacitor ? 'index.html' : ''
      location.replace('/' + (language ?? 'en') + '/' + file + location.search + location.hash)`

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`)

/** The x-default page: it sends each visitor, and the Android app, to the version in their system language. */
export function rootPage() {
  const description = escapeHtml(pageMeta('es').description)
  const title = escapeHtml(LANGUAGES.map((language) => stringsFor(language).title).join(' · '))
  const links = LANGUAGES.map(
    (language) =>
      `<a href="${pageUrl(language)}" hreflang="${language}" lang="${language}">${escapeHtml(stringsFor(language).title)}</a>`,
  ).join(' · ')

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${ROOT_URL}" />
    ${alternateLinks}
    ${renderToStaticMarkup(<OpenGraph language="es" url={ROOT_URL} />)}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <script>
      ${redirect}
    </script>
  </head>
  <body>
    <p>${links}</p>
  </body>
</html>
`
}

export function sitemap() {
  const links = alternates
    .map(({ hrefLang, href }) => `<xhtml:link rel="alternate" hreflang="${hrefLang}" href="${href}"/>`)
    .join('')
  const urls = LANGUAGES.map((language) => `<url><loc>${pageUrl(language)}</loc>${links}</url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}
