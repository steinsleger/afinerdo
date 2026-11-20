import type { Language } from './i18n.ts'
import { alternates, pageMeta, scriptJson } from './seo.ts'

export function Head({ language }: { language: Language }) {
  const meta = pageMeta(language)

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.url} />
      {alternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <OpenGraph language={language} url={meta.url} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: scriptJson(meta.jsonLd) }} />
    </>
  )
}

/** Link previews, also used by the root page under its own URL. */
export function OpenGraph({ language, url }: { language: Language; url: string }) {
  const meta = pageMeta(language)

  return (
    <>
      <meta property="og:site_name" content={meta.name} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={meta.locale} />
      {meta.otherLocales.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
