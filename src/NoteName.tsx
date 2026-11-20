import { spoken, useStrings } from './i18n.ts'

/** A note name whose ♯ or ♭ screen readers hear as a word. */
export function NoteName({ name }: { name: string }) {
  const t = useStrings()
  return (
    <>
      <span aria-hidden="true">{name}</span>
      <span className="visually-hidden">{spoken(name, t)}</span>
    </>
  )
}
