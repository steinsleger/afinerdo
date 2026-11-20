type SegmentedProps<T extends string> = {
  legend: string
  hideLegend?: boolean
  name: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function Segmented<T extends string>({ legend, hideLegend = false, name, options, value, onChange }: SegmentedProps<T>) {
  return (
    <fieldset className="segmented">
      <legend className={hideLegend ? 'visually-hidden' : 'label'}>{legend}</legend>
      <div className="segmented-options">
        {options.map((option) => (
          <label key={option.value}>
            <input type="radio" name={name} checked={value === option.value} onChange={() => onChange(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
