import { useStrings } from './i18n.ts'

type StepperProps = {
  label: string
  value: number
  unit?: string
  min: number
  max: number
  disabled?: boolean
  onChange: (value: number) => void
}

// A button at its limit stays focusable, through aria-disabled, so pressing it to the limit doesn't drop keyboard focus.
export function Stepper({ label, value, unit, min, max, disabled = false, onChange }: StepperProps) {
  const t = useStrings()
  const atMin = value <= min
  const atMax = value >= max

  return (
    <div className="stepper" role="group" aria-label={label} aria-disabled={disabled}>
      <span className="label">{label}</span>
      <button
        type="button"
        aria-label={`${t.decrease} ${label}`}
        disabled={disabled}
        aria-disabled={atMin}
        onClick={() => {
          if (!atMin) onChange(value - 1)
        }}
      >
        −
      </button>
      <output className="stepper-value">
        {value}
        {unit && <small>{unit}</small>}
      </output>
      <button
        type="button"
        aria-label={`${t.increase} ${label}`}
        disabled={disabled}
        aria-disabled={atMax}
        onClick={() => {
          if (!atMax) onChange(value + 1)
        }}
      >
        +
      </button>
    </div>
  )
}
