import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { spoken, useStrings } from './i18n.ts'
import { NoteName } from './NoteName.tsx'
import { nearestNote, noteLabel } from './notes.ts'
import { StatusRow } from './StatusRow.tsx'
import { createAnnouncer, createTuningTracker } from './tuning.ts'
import { useListener } from './useListener.ts'

const SCALE_CENTS = 50

function formatCents(cents: number) {
  const rounded = Math.round(cents)
  return `${rounded > 0 ? '+' : rounded < 0 ? '−' : '±'}${Math.abs(rounded)} ¢`
}

// The microphone runs at frame rate, so readings are written straight to the DOM instead of through React state.
type TuningMeterProps = {
  target: number
  a4: number
  statusRef: RefObject<HTMLParagraphElement | null>
}

export function TuningMeter({ target, a4, statusRef }: TuningMeterProps) {
  const t = useStrings()
  const meterRef = useRef<HTMLDivElement>(null)
  const centsRef = useRef<HTMLSpanElement>(null)
  const heardRef = useRef<HTMLSpanElement>(null)
  const heardSpokenRef = useRef<HTMLSpanElement>(null)
  const track = useMemo(() => createTuningTracker(target, a4), [target, a4])
  const announce = useMemo(() => createAnnouncer(), [target, a4])

  const say = (text: string) => {
    if (statusRef.current) statusRef.current.textContent = text
  }

  const showHeard = (text: string) => {
    if (!heardRef.current || !heardSpokenRef.current) return
    heardRef.current.textContent = text
    heardSpokenRef.current.textContent = spoken(text, t)
  }

  const status = useListener((hz) => {
    const meter = meterRef.current
    if (!meter || !centsRef.current) return
    const now = performance.now()
    const reading = track(hz, now)
    meter.dataset.state = reading.state
    const said = announce(reading.state, now)
    if (said) say(t[said])
    if (reading.state === 'none') {
      say('')
      centsRef.current.textContent = ''
      showHeard('')
      return
    }
    const { pitchClass, octave } = nearestNote(reading.hz, a4)
    meter.style.setProperty('--cents', String(Math.max(-SCALE_CENTS, Math.min(SCALE_CENTS, reading.cents))))
    centsRef.current.textContent = formatCents(reading.cents)
    showHeard(`${noteLabel(pitchClass, t.naturals).name}${octave}`)
  })

  const message = status === 'listening' ? null : t[status]

  // The status region is emptied whenever the announcer starts over, or a repeated text would go unannounced.
  useEffect(() => {
    say(message ?? '')
    return () => say('')
  }, [message, announce])

  // Keyed by status, so losing the microphone also clears the last reading written to the DOM.
  return (
    <div className="meter" key={status} ref={meterRef} data-state="none">
      <StatusRow label={t.listen} live={status === 'listening'}>
        <span aria-hidden="true" ref={heardRef} />
        <span className="visually-hidden" ref={heardSpokenRef} />
      </StatusRow>
      <div className="display-row">
        <p className="display-note">
          <NoteName name={noteLabel(target, t.naturals).name} />
        </p>
        <p className="meter-reading">
          {message ? (
            <span aria-hidden="true">{message}</span>
          ) : (
            <>
              <span className="meter-state" data-for="none">{t.playNow}</span>
              <span className="meter-state" data-for="low">{t.low}</span>
              <span className="meter-state" data-for="inTune">{t.inTune}</span>
              <span className="meter-state" data-for="high">{t.high}</span>
            </>
          )}
          <span className="meter-cents" ref={centsRef} />
        </p>
      </div>
      <div className="meter-scale" aria-hidden="true">
        <span className="meter-needle" />
      </div>
    </div>
  )
}
