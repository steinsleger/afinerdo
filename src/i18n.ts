import { createContext, useContext } from 'react'

const es = {
  title: 'Afinerdo',
  tagline: 'Afinador cromático para nerds',
  about:
    'Afinerdo es un afinador cromático gratuito para guitarra, bajo, violín, ukelele, voz o cualquier instrumento. Toque una nota para escuchar un tono puro de referencia, o elija una y use el micrófono: la pantalla le indica si suena más abajo o más arriba. La app de Android funciona sin conexión.',
  pageTitle: 'Afinador cromático online y nota de referencia | Afinerdo',
  pageDescription:
    'Afinerdo, el afinador para nerds: escuche un tono puro de referencia o afine guitarra, bajo, violín, ukelele o voz con el micrófono. Gratis y sin anuncios.',
  locale: 'es_AR',
  imageAlt: 'Afinerdo: una grilla con las 12 notas y la pantalla del afinador marcando La4 a 440 Hz.',
  browserRequirements: 'Requiere JavaScript y Web Audio',
  naturals: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'],
  notes: 'Notas',
  sharp: 'sostenido',
  flat: 'bemol',
  octave: 'Octava',
  decrease: 'Bajar',
  increase: 'Subir',
  mode: 'Modo',
  tone: 'Tono',
  listen: 'Micrófono',
  pickNote: 'Toque una nota',
  pickTarget: 'Toque la nota que quiere afinar',
  playNow: 'Toque su instrumento',
  low: 'Más abajo',
  high: 'Más arriba',
  inTune: 'Afinado',
  starting: 'Abriendo el micrófono',
  denied: 'Permita el acceso al micrófono',
  unavailable: 'Micrófono no disponible',
  settings: 'Ajustes',
  close: 'Cerrar',
  theme: 'Tema',
  themes: { system: 'Sistema', light: 'Claro', dark: 'Oscuro' },
  createdBy: 'Creado por',
  feedback: 'Sugerencias y errores',
  email: 'Correo',
  privacy: 'Privacidad',
  source: 'Código fuente',
  license: 'Licencia CC BY-NC 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/deed.es',
}

const en: typeof es = {
  title: 'Nerd Tuner',
  tagline: 'A chromatic tuner for nerds',
  about:
    'Nerd Tuner is a free chromatic tuner for guitar, bass, violin, ukulele, voice or any instrument. Tap a note to hear a pure reference tone, or choose one and use the microphone: the screen shows whether you sound too low or too high. The Android app works offline.',
  pageTitle: 'Online chromatic tuner and reference tone | Nerd Tuner',
  pageDescription:
    'Nerd Tuner, the tuner for nerds: hear a pure reference tone or tune guitar, bass, violin, ukulele or voice with your microphone. Free, no ads.',
  locale: 'en_US',
  imageAlt: 'Nerd Tuner: a grid of the 12 notes and the tuner screen showing A4 at 440 Hz.',
  browserRequirements: 'Requires JavaScript and Web Audio',
  naturals: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  notes: 'Notes',
  sharp: 'sharp',
  flat: 'flat',
  octave: 'Octave',
  decrease: 'Lower',
  increase: 'Raise',
  mode: 'Mode',
  tone: 'Tone',
  listen: 'Microphone',
  pickNote: 'Tap a note',
  pickTarget: 'Tap the note you want to tune',
  playNow: 'Play your instrument',
  low: 'Too low',
  high: 'Too high',
  inTune: 'In tune',
  starting: 'Opening the microphone',
  denied: 'Allow microphone access',
  unavailable: 'Microphone unavailable',
  settings: 'Settings',
  close: 'Close',
  theme: 'Theme',
  themes: { system: 'System', light: 'Light', dark: 'Dark' },
  createdBy: 'Created by',
  feedback: 'Feedback and bugs',
  email: 'Email',
  privacy: 'Privacy',
  source: 'Source code',
  license: 'CC BY-NC 4.0 license',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/deed.en',
}

const STRINGS = { es, en }

export type Language = keyof typeof STRINGS

export const LANGUAGES = Object.keys(STRINGS) as Language[]

export const isLanguage = (code: string): code is Language => Object.hasOwn(STRINGS, code)

/** Each page has its language in the first segment of its path; anything else is English, like the root page's fallback. */
export function languageOfPath(path: string): Language {
  const segment = path.split('/')[1] ?? ''
  return isLanguage(segment) ? segment : 'en'
}

export const stringsFor = (language: Language) => STRINGS[language]

const LanguageContext = createContext<Language>('es')

export const LanguageProvider = LanguageContext.Provider

export const useLanguage = () => useContext(LanguageContext)

export const useStrings = () => STRINGS[useLanguage()]

/** Spells out ♯ and ♭ for screen readers, which otherwise read them as symbols. */
export const spoken = (text: string, t: Strings) => text.replace('♯', ` ${t.sharp}`).replace('♭', ` ${t.flat}`)

type Strings = typeof es
