import { useEffect, useState } from 'react'
import { Display } from './Display.tsx'
import { useStrings } from './i18n.ts'
import { ModeSwitch, type Mode } from './ModeSwitch.tsx'
import { NoteGrid } from './NoteGrid.tsx'
import { A4_DEFAULT, A4_MAX, A4_MIN, frequency, OCTAVE_DEFAULT, OCTAVE_MAX, OCTAVE_MIN } from './notes.ts'
import { usePreference, useTheme } from './preferences.ts'
import { Settings } from './Settings.tsx'
import { Stepper } from './Stepper.tsx'
import { suspendAudio, unlockAudio, useTone } from './tone.ts'

function parseA4(stored: string) {
  const hz = Number(stored)
  return Number.isInteger(hz) && hz >= A4_MIN && hz <= A4_MAX ? hz : undefined
}

export function App() {
  const t = useStrings()
  const [theme, setTheme] = useTheme()
  const [a4, setA4] = usePreference('a4', A4_DEFAULT, parseA4)
  const [mode, setMode] = useState<Mode>('tone')
  const [active, setActive] = useState<number | null>(null)
  const [octave, setOctave] = useState(OCTAVE_DEFAULT)

  const listening = mode === 'listen'

  useTone(listening || active === null ? null : frequency(active, octave, a4))

  useEffect(() => {
    const releaseWhenHidden = () => {
      if (!document.hidden) return
      setActive(null)
      suspendAudio()
    }
    document.addEventListener('visibilitychange', releaseWhenHidden)
    return () => document.removeEventListener('visibilitychange', releaseWhenHidden)
  }, [])

  function toggle(pitchClass: number) {
    unlockAudio()
    setActive((current) => (current === pitchClass ? null : pitchClass))
  }

  function changeMode(next: Mode) {
    unlockAudio()
    setMode(next)
  }

  return (
    <main className="device">
      <header className="topbar">
        <h1 className="title">
          <span className="wordmark">{t.title}</span>
          <span className="tagline">{t.tagline}</span>
        </h1>
        <Settings theme={theme} onThemeChange={setTheme} />
      </header>
      <Display mode={mode} pitchClass={active} octave={octave} a4={a4} />
      <NoteGrid active={active} onToggle={toggle} />
      <div className="controls">
        <Stepper label={`${t.naturals[5]}4`} value={a4} unit="Hz" min={A4_MIN} max={A4_MAX} onChange={setA4} />
        <Stepper
          label={t.octave}
          value={octave}
          min={OCTAVE_MIN}
          max={OCTAVE_MAX}
          disabled={listening}
          onChange={setOctave}
        />
        <ModeSwitch mode={mode} onChange={changeMode} />
      </div>
    </main>
  )
}
