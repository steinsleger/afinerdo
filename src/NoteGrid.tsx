import { spoken, useStrings } from './i18n.ts'
import { noteLabel, PITCH_CLASSES } from './notes.ts'

type NoteGridProps = {
  active: number | null
  onToggle: (pitchClass: number) => void
}

export function NoteGrid({ active, onToggle }: NoteGridProps) {
  const t = useStrings()
  return (
    <div className="grid" role="group" aria-label={t.notes}>
      {PITCH_CLASSES.map((pitchClass) => {
        const { name, flat } = noteLabel(pitchClass, t.naturals)
        return (
          <button
            key={pitchClass}
            type="button"
            className={flat ? 'key key-black' : 'key'}
            aria-pressed={active === pitchClass}
            onClick={() => onToggle(pitchClass)}
          >
            <span aria-hidden="true">{name}</span>
            {flat && (
              <span className="key-flat" aria-hidden="true">
                {flat}
              </span>
            )}
            <span className="visually-hidden">{flat ? `${spoken(name, t)}, ${spoken(flat, t)}` : name}</span>
          </button>
        )
      })}
    </div>
  )
}
