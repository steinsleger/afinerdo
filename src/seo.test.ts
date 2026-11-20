import assert from 'node:assert/strict'
import test from 'node:test'
import { LANGUAGES, languageOfPath } from './i18n.ts'
import { alternates, pageMeta, pageUrl, ROOT_URL } from './seo.ts'

test('the language comes from the first segment of the path', () => {
  assert.equal(languageOfPath('/es/'), 'es')
  assert.equal(languageOfPath('/en/'), 'en')
  assert.equal(languageOfPath('/es/index.html'), 'es')
  assert.equal(languageOfPath('/'), 'en')
  assert.equal(languageOfPath('/fr/'), 'en')
})

test('every language links every other one and the root as x-default', () => {
  assert.deepEqual(
    alternates.map(({ hrefLang }) => hrefLang),
    [...LANGUAGES, 'x-default'],
  )
  assert.equal(alternates.at(-1)?.href, ROOT_URL)
})

test('each page has its own canonical URL and fits in a search result', () => {
  for (const language of LANGUAGES) {
    const meta = pageMeta(language)
    assert.equal(meta.url, pageUrl(language))
    assert.ok(meta.title.length <= 60, `${language} title is ${meta.title.length} characters`)
    assert.ok(meta.description.length <= 160, `${language} description is ${meta.description.length} characters`)
    assert.equal(meta.jsonLd.inLanguage, language)
  }
  assert.equal(new Set(LANGUAGES.map(pageUrl)).size, LANGUAGES.length)
})
