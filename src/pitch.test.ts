import assert from 'node:assert/strict'
import test from 'node:test'
import { createPitchDetector, windowSizeFor } from './pitch.ts'

const SAMPLE_RATE = 48000
const SIZE = windowSizeFor(SAMPLE_RATE)
const detect = createPitchDetector(SIZE, SAMPLE_RATE)

const sine = (phase: number) => Math.sin(2 * Math.PI * phase)
const sawtooth = (phase: number) => 2 * (phase - Math.floor(phase + 0.5))

function signal(hz: number, shape: (phase: number) => number, amplitude = 0.5) {
  return Float32Array.from({ length: SIZE }, (_, i) => amplitude * shape((hz * i) / SAMPLE_RATE + 0.13))
}

function seededNoise() {
  let seed = 42
  return Float32Array.from({ length: SIZE }, () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32
    return seed / 2 ** 31 - 1
  })
}

function assertWithinCents(detected: number | null, expected: number, cents: number) {
  assert.ok(detected !== null, `nothing detected at ${expected} Hz`)
  const error = 1200 * Math.log2(detected / expected)
  assert.ok(Math.abs(error) < cents, `${detected} Hz is ${error.toFixed(2)} cents from ${expected} Hz`)
}

for (const hz of [30, 41.2, 82.41, 110, 261.63, 440, 1000, 2093]) {
  test(`detects a ${hz} Hz sine within 1 cent`, () => {
    assertWithinCents(detect(signal(hz, sine)), hz, 1)
  })
}

for (const sampleRate of [44100, 96000, 192000]) {
  test(`detects a 30.87 Hz sine at ${sampleRate} Hz within 1 cent`, () => {
    const size = windowSizeFor(sampleRate)
    const samples = Float32Array.from({ length: size }, (_, i) => 0.5 * sine((30.87 * i) / sampleRate + 0.13))
    assertWithinCents(createPitchDetector(size, sampleRate)(samples), 30.87, 1)
  })
}

test('the window never exceeds the largest AnalyserNode size', () => {
  assert.equal(windowSizeFor(768000), 32768)
})

test('detects a 4186 Hz sine within 3 cents', () => {
  assertWithinCents(detect(signal(4186, sine)), 4186, 3)
})

for (const hz of [41.2, 110, 440, 1000]) {
  test(`detects the fundamental of a ${hz} Hz sawtooth within 1 cent`, () => {
    assertWithinCents(detect(signal(hz, sawtooth)), hz, 1)
  })
}

test('a DC offset does not hide the pitch', () => {
  assertWithinCents(detect(signal(110, sine, 0.01).map((sample) => sample + 0.01)), 110, 1)
})

test('silence has no pitch', () => {
  assert.equal(detect(new Float32Array(SIZE)), null)
})

test('a signal below the noise floor has no pitch', () => {
  assert.equal(detect(signal(440, sine, 0.001)), null)
})

test('white noise has no pitch', () => {
  assert.equal(detect(seededNoise()), null)
})
