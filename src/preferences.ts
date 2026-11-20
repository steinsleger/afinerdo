import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core'
import { useLayoutEffect, useState } from 'react'

const storageKey = (name: string) => `afinerdo:${name}`

function read(name: string) {
  try {
    return localStorage.getItem(storageKey(name))
  } catch {
    return null
  }
}

function write(name: string, value: string) {
  try {
    localStorage.setItem(storageKey(name), value)
  } catch {
    // Storage can be blocked or full. The choice still applies, it just won't be remembered.
  }
}

/**
 * Stores only what the user chooses, so untouched defaults keep following the system. The first render must match the
 * prerendered page, so a stored value replaces the default only once the script has loaded.
 */
export function usePreference<T>(name: string, fallback: T, parse: (stored: string) => T | undefined) {
  const [value, setValue] = useState(fallback)

  useLayoutEffect(() => {
    const stored = read(name)
    const parsed = stored === null ? undefined : parse(stored)
    if (parsed !== undefined) setValue(parsed)
  }, [])

  function choose(next: T) {
    setValue(next)
    write(name, String(next))
  }

  return [value, choose] as const
}

export const THEMES = ['system', 'light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

const SYSTEM_BARS_STYLE: Record<Theme, SystemBarsStyle> = {
  system: SystemBarsStyle.Default,
  light: SystemBarsStyle.Light,
  dark: SystemBarsStyle.Dark,
}

// Below WebView 140, Capacitor pads the bars with the native window background, which follows the system theme.
const barsFollowSystem = () => Number(/Chrome\/(\d+)/.exec(navigator.userAgent)?.[1]) < 140

function applyTheme(theme: Theme) {
  if (theme === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
  const background = getComputedStyle(document.body).backgroundColor
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute('content', background)
  if (Capacitor.isNativePlatform()) {
    void SystemBars.setStyle({ style: barsFollowSystem() ? SystemBarsStyle.Default : SYSTEM_BARS_STYLE[theme] })
  }
}

// index.html applies a stored theme before the first paint, with the same storage key.
export function useTheme() {
  const [theme, setTheme] = usePreference<Theme>('theme', 'system', (stored) =>
    THEMES.find((option) => option === stored),
  )

  // Capacitor resolves the default bar style only once, so a change in the system theme applies it again.
  useLayoutEffect(() => {
    const systemDark = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => applyTheme(theme)
    apply()
    systemDark.addEventListener('change', apply)
    return () => systemDark.removeEventListener('change', apply)
  }, [theme])

  return [theme, setTheme] as const
}
