import { LANGUAGES, stringsFor, type Language } from './i18n.ts'

export const SITE_URL = 'https://afinerdo.com.ar'
export const ROOT_URL = `${SITE_URL}/`

const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/'

const CREATOR = {
  '@type': 'Person',
  name: 'Adrián Steinsleger',
  url: 'https://www.linkedin.com/in/adriansteinsleger/',
  sameAs: ['https://www.linkedin.com/in/adriansteinsleger/', 'https://www.youtube.com/@AdrianSteinsleger'],
}

export const pageUrl = (language: Language) => `${SITE_URL}/${language}/`

export const ogImageUrl = (language: Language) => `${SITE_URL}/og-${language}.png`

/** Every language version, plus the root as x-default because it sends each visitor to their system language. */
export const alternates = [
  ...LANGUAGES.map((language) => ({ hrefLang: language, href: pageUrl(language) })),
  { hrefLang: 'x-default', href: ROOT_URL },
]

export function pageMeta(language: Language) {
  const strings = stringsFor(language)
  const { title: name, pageTitle: title, pageDescription: description, locale, imageAlt } = strings
  const others = LANGUAGES.filter((other) => other !== language)

  return {
    name,
    title,
    description,
    locale,
    otherLocales: others.map((other) => stringsFor(other).locale),
    url: pageUrl(language),
    image: ogImageUrl(language),
    imageAlt,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name,
      alternateName: others.map((other) => stringsFor(other).title),
      url: pageUrl(language),
      description,
      inLanguage: language,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web, Android',
      browserRequirements: strings.browserRequirements,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      image: ogImageUrl(language),
      author: CREATOR,
      license: LICENSE_URL,
    },
  }
}

/** JSON for an inline script: `<` is escaped so no value can close the script tag. */
export const scriptJson = (value: object) => JSON.stringify(value).replace(/</g, '\\u003c')
