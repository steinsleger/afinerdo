import { centsFrom, foldOctave, IN_TUNE_CENTS } from './notes.ts'

const HOLD_MS = 300
const IN_TUNE_MS = 300
// Once in tune, a reading has to stray past this to leave, so a pitch at the edge of the tolerance doesn't flicker.
const RELEASE_CENTS = IN_TUNE_CENTS + 3
// Time constant of the smoothing, so the needle moves the same at any frame rate.
const SMOOTHING_MS = 40

/** `settling` is within tolerance but not yet held long enough to count as in tune. `hz` is smoothed like `cents`. */
export type Reading =
  | { state: 'none' }
  | { state: 'low' | 'settling' | 'inTune' | 'high'; cents: number; hz: number }

/** Turns a stream of detected frequencies into a steady reading against the target pitch class. */
export function createTuningTracker(targetPitchClass: number, a4: number) {
  let cents: number | null = null
  let hz = 0
  let lastHeard = -Infinity
  let inTuneSince: number | null = null

  // Like the reading, the hold carries on through dropouts shorter than HOLD_MS.
  const held = () => inTuneSince !== null && lastHeard - inTuneSince >= IN_TUNE_MS

  return function track(heard: number | null, now: number): Reading {
    if (heard !== null) {
      const measured = centsFrom(heard, targetPitchClass, a4)
      const weight = 1 - Math.exp((lastHeard - now) / SMOOTHING_MS)
      cents = cents === null ? measured : foldOctave(cents + foldOctave(measured - cents) * weight)
      const tolerance = held() ? RELEASE_CENTS : IN_TUNE_CENTS
      inTuneSince = Math.abs(cents) <= tolerance ? (inTuneSince ?? now) : null
      hz = heard * 2 ** (foldOctave(cents - measured) / 1200)
      lastHeard = now
    } else if (now - lastHeard > HOLD_MS) {
      cents = null
      inTuneSince = null
    }

    if (cents === null) return { state: 'none' }
    if (held()) return { state: 'inTune', cents, hz }
    return { state: Math.abs(cents) <= IN_TUNE_CENTS ? 'settling' : cents < 0 ? 'low' : 'high', cents, hz }
  }
}

const ANNOUNCE_INTERVAL_MS = 1500

/** Picks the readings worth saying aloud: only changes of state, at most one per interval, so screen readers keep up. */
export function createAnnouncer() {
  let last: Reading['state'] = 'none'
  let lastAt = -Infinity

  return function announce(state: Reading['state'], now: number) {
    if (state === 'none') last = 'none'
    if (state === 'none' || state === 'settling' || state === last || now - lastAt < ANNOUNCE_INTERVAL_MS) return null
    last = state
    lastAt = now
    return state
  }
}
