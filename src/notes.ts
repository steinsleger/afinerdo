export const PITCH_CLASSES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
export const A4_DEFAULT = 440
export const A4_MIN = 400
export const A4_MAX = 480
export const OCTAVE_DEFAULT = 4
export const OCTAVE_MIN = 2
export const OCTAVE_MAX = 7
export const IN_TUNE_CENTS = 5

const NATURAL_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11]

const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor
const semitonesFromA4 = (hz: number, a4: number) => 12 * Math.log2(hz / a4)

export const frequency = (pitchClass: number, octave: number, a4: number) =>
  a4 * 2 ** ((12 * (octave + 1) + pitchClass - 69) / 12)

/** Folds cents into the octave around zero, from -600 to 600. */
export function foldOctave(cents: number) {
  const folded = modulo(cents, 1200)
  return folded > 600 ? folded - 1200 : folded
}

export const centsFrom = (hz: number, targetPitchClass: number, a4: number) =>
  foldOctave(100 * (semitonesFromA4(hz, a4) + 9 - targetPitchClass))

export function nearestNote(hz: number, a4: number) {
  const midi = Math.round(69 + semitonesFromA4(hz, a4))
  return { pitchClass: modulo(midi, 12), octave: Math.floor(midi / 12) - 1 }
}

export function noteLabel(pitchClass: number, naturals: readonly string[]) {
  const natural = NATURAL_PITCH_CLASSES.indexOf(pitchClass)
  if (natural >= 0) return { name: naturals[natural] }
  const below = NATURAL_PITCH_CLASSES.indexOf(pitchClass - 1)
  return { name: `${naturals[below]}♯`, flat: `${naturals[below + 1]}♭` }
}
