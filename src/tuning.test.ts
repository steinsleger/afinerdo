import assert from 'node:assert/strict'
import test from 'node:test'
import { centsFrom } from './notes.ts'
import { createAnnouncer, createTuningTracker } from './tuning.ts'

const A = 9
const detune = (hz: number, cents: number) => hz * 2 ** (cents / 1200)

test('nothing heard reads as none', () => {
  const track = createTuningTracker(A, 440)
  assert.deepEqual(track(null, 0), { state: 'none' })
})

test('a flat note reads low and a sharp one high', () => {
  assert.equal(createTuningTracker(A, 440)(detune(440, -20), 0).state, 'low')
  assert.equal(createTuningTracker(A, 440)(detune(440, 20), 0).state, 'high')
})

test('any octave of the target counts', () => {
  const reading = createTuningTracker(A, 440)(110, 0)
  assert.ok(reading.state !== 'none')
  assert.ok(Math.abs(reading.cents) < 0.01)
})

test('in tune only after holding within 5 cents for 300 ms', () => {
  const track = createTuningTracker(A, 440)
  assert.equal(track(detune(440, 3), 0).state, 'settling')
  assert.equal(track(detune(440, 3), 200).state, 'settling')
  assert.equal(track(detune(440, 3), 300).state, 'inTune')
  assert.equal(track(detune(440, 40), 320).state, 'high')
})

test('once in tune, a reading has to stray past 8 cents to leave', () => {
  const track = createTuningTracker(A, 440)
  track(detune(440, 3), 0)
  track(detune(440, 3), 300)
  // Long enough at each pitch for the smoothing to settle on it.
  const steady = (cents: number, from: number) => {
    let reading = track(detune(440, cents), from)
    for (let now = from + 16; now < from + 320; now += 16) reading = track(detune(440, cents), now)
    return reading.state
  }
  assert.equal(steady(7.5, 316), 'inTune')
  assert.equal(steady(8.5, 636), 'high')
})

test('silence alone never completes the in-tune hold', () => {
  const track = createTuningTracker(A, 440)
  track(detune(440, 3), 0)
  track(detune(440, 3), 100)
  assert.notEqual(track(null, 350).state, 'inTune')
})

test('a tritone that wobbles across the fold stays a tritone', () => {
  const track = createTuningTracker(A, 440)
  const dSharp = 440 * 2 ** (-6 / 12)
  for (const [frame, wobble] of [-2, 2, -2, 2, -2, 2].entries()) {
    const reading = track(detune(dSharp, wobble), frame * 16)
    assert.ok(reading.state !== 'none' && Math.abs(reading.cents) > 590)
  }
})

test('readings are smoothed toward the new pitch', () => {
  const track = createTuningTracker(A, 440)
  track(detune(440, -40), 0)
  const reading = track(detune(440, 0), 16)
  assert.ok(reading.state !== 'none')
  assert.ok(reading.cents < 0 && reading.cents > -40)
  assert.ok(Math.abs(centsFrom(reading.hz, A, 440) - reading.cents) < 0.01)
})

test('smoothing follows elapsed time, not the frame rate', () => {
  const at60 = createTuningTracker(A, 440)
  const at120 = createTuningTracker(A, 440)
  at60(detune(440, -40), 0)
  at120(detune(440, -40), 0)
  at120(detune(440, 0), 8)
  const slow = at60(detune(440, 0), 16)
  const fast = at120(detune(440, 0), 16)
  assert.ok(slow.state !== 'none' && fast.state !== 'none')
  assert.ok(Math.abs(slow.cents - fast.cents) < 0.01)
})

test('short dropouts keep the last reading and long ones clear it', () => {
  const track = createTuningTracker(A, 440)
  track(detune(440, -20), 0)
  assert.equal(track(null, 200).state, 'low')
  assert.equal(track(null, 400).state, 'none')
})

test('announcements follow state changes at most once per interval', () => {
  const announce = createAnnouncer()
  assert.equal(announce('none', 0), null)
  assert.equal(announce('low', 0), 'low')
  assert.equal(announce('inTune', 1000), null)
  assert.equal(announce('low', 1600), null)
  assert.equal(announce('inTune', 1700), 'inTune')
  assert.equal(announce('settling', 4000), null)
  assert.equal(announce('high', 4000), 'high')
})

test('after silence, the same state is announced again', () => {
  const announce = createAnnouncer()
  assert.equal(announce('inTune', 0), 'inTune')
  assert.equal(announce('none', 2000), null)
  assert.equal(announce('inTune', 2000), 'inTune')
})
