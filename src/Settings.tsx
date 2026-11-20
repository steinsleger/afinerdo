import { useRef, type ReactNode } from 'react'
import { useStrings } from './i18n.ts'
import { THEMES, type Theme } from './preferences.ts'
import { Segmented } from './Segmented.tsx'

const REPO_URL = 'https://github.com/steinsleger/afinerdo'
const CONTACT_EMAIL = 'asteins@gmail.com'

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

type SettingsProps = {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

export function Settings({ theme, onThemeChange }: SettingsProps) {
  const t = useStrings()
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" className="topbar-button" onClick={() => dialogRef.current?.showModal()}>
        {t.settings}
      </button>
      <dialog ref={dialogRef} className="sheet" aria-labelledby="settings-title">
        <div className="sheet-header">
          <h2 id="settings-title" className="wordmark">
            {t.settings}
          </h2>
          <form method="dialog">
            <button className="topbar-button">{t.close}</button>
          </form>
        </div>
        <Segmented
          legend={t.theme}
          name="theme"
          options={THEMES.map((value) => ({ value, label: t.themes[value] }))}
          value={theme}
          onChange={onThemeChange}
        />
        <p className="about">{t.about}</p>
        <div className="credits">
          <p>
            {t.title}. {t.createdBy} Adrián Steinsleger ·{' '}
            <ExternalLink href="https://www.linkedin.com/in/adriansteinsleger/">LinkedIn</ExternalLink> ·{' '}
            <ExternalLink href="https://www.youtube.com/@AdrianSteinsleger">YouTube</ExternalLink>
          </p>
          <p>
            <ExternalLink href={`${REPO_URL}/issues/new?template=feedback.yml`}>{t.feedback}</ExternalLink> ·{' '}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.title)}`}>{t.email}</a> ·{' '}
            <ExternalLink href={REPO_URL}>{t.source}</ExternalLink> ·{' '}
            <ExternalLink href={t.licenseUrl}>{t.license}</ExternalLink> ·{' '}
            <ExternalLink href={`${REPO_URL}/blob/main/PRIVACY.md`}>{t.privacy}</ExternalLink>
          </p>
        </div>
      </dialog>
    </>
  )
}
