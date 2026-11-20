import { useStrings } from './i18n.ts'
import { Segmented } from './Segmented.tsx'

export type Mode = 'tone' | 'listen'

export function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const t = useStrings()
  return (
    <Segmented
      legend={t.mode}
      hideLegend
      name="mode"
      options={[
        { value: 'tone', label: t.tone },
        { value: 'listen', label: t.listen },
      ]}
      value={mode}
      onChange={onChange}
    />
  )
}
