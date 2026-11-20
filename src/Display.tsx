import { useRef } from 'react'
import { useLanguage, useStrings } from './i18n.ts'
import type { Mode } from './ModeSwitch.tsx'
import { NoteName } from './NoteName.tsx'
import { frequency, noteLabel } from './notes.ts'
import { StatusRow } from './StatusRow.tsx'
import { TuningMeter } from './TuningMeter.tsx'

type DisplayProps = {
  mode: Mode
  pitchClass: number | null
  octave: number
  a4: number
}

export function Display({ mode, pitchClass, octave, a4 }: DisplayProps) {
  const statusRef = useRef<HTMLParagraphElement>(null)

  // The status region outlives the meter, because screen readers only announce changes in a region that was already there.
  return (
    <section className="display">
      {pitchClass === null ? (
        <Idle mode={mode} />
      ) : mode === 'listen' ? (
        <TuningMeter target={pitchClass} a4={a4} statusRef={statusRef} />
      ) : (
        <ToneReadout pitchClass={pitchClass} octave={octave} a4={a4} />
      )}
      <p className="visually-hidden" role="status" ref={statusRef} />
    </section>
  )
}

function Idle({ mode }: { mode: Mode }) {
  const t = useStrings()
  return (
    <>
      <StatusRow label={t[mode]} live={false} />
      <p className="display-hint">{mode === 'tone' ? t.pickNote : t.pickTarget}</p>
    </>
  )
}

function ToneReadout({ pitchClass, octave, a4 }: { pitchClass: number; octave: number; a4: number }) {
  const t = useStrings()
  const language = useLanguage()
  const { name, flat } = noteLabel(pitchClass, t.naturals)
  const hz = frequency(pitchClass, octave, a4)

  return (
    <>
      <StatusRow label={t.tone} live>
        {flat && <NoteName name={flat} />}
      </StatusRow>
      <div className="display-row">
        <p className="display-note">
          <NoteName name={name} />
          <sub>{octave}</sub>
        </p>
        <p className="display-hz">
          {hz.toLocaleString(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <small>Hz</small>
        </p>
      </div>
    </>
  )
}
