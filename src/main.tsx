import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { languageOfPath, LanguageProvider } from './i18n.ts'
import './styles.css'

const root = document.getElementById('root')!
const language = languageOfPath(location.pathname)
document.documentElement.lang = language

const app = (
  <StrictMode>
    <LanguageProvider value={language}>
      <App />
    </LanguageProvider>
  </StrictMode>
)

// Built pages arrive prerendered; the development server serves an empty root.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
