import assert from 'node:assert/strict'
import test from 'node:test'
import { A4_MAX, A4_MIN, centsFrom, frequency, nearestNote, noteLabel, OCTAVE_MAX, OCTAVE_MIN } from './notes.ts'

const SPANISH = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']

function assertClose(actual: number, expected: number, tolerance = 0.01) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`)
}

const detune = (hz: number, cents: number) => hz * 2 ** (cents / 1200)

test('frequency follows equal temperament from the reference', () => {
  assertClose(frequency(9, 4, 440), 440)
  assertClose(frequency(0, 4, 440), 261.63)
  assertClose(frequency(9, 3, 440), 220)
  assertClose(frequency(4, 2, 440), 82.41)
  assertClose(frequency(9, 4, 442), 442)
  assertClose(frequency(0, 4, 400), 237.84)
})

test('every note in the octave range is audible at any A4', () => {
  assert.ok(frequency(0, OCTAVE_MIN, A4_MIN) >= 20)
  assert.ok(frequency(11, OCTAVE_MAX, A4_MAX) <= 20000)
})

test('cents are measured against the nearest octave of the target', () => {
  assertClose(centsFrom(440, 9, 440), 0)
  assertClose(centsFrom(880, 9, 440), 0)
  assertClose(centsFrom(110, 9, 440), 0)
  assertClose(centsFrom(detune(440, 20), 9, 440), 20)
  assertClose(centsFrom(detune(82.41, -30), 4, 440), -30, 0.1)
  assertClose(centsFrom(440, 10, 440), -100)
  assertClose(centsFrom(440, 0, 440), -300)
  assertClose(centsFrom(442, 9, 442), 0)
})

test('nearest note names the pitch class and octave', () => {
  assert.deepEqual(nearestNote(440, 440), { pitchClass: 9, octave: 4 })
  assert.deepEqual(nearestNote(82.41, 440), { pitchClass: 4, octave: 2 })
  assert.deepEqual(nearestNote(detune(261.63, -40), 440), { pitchClass: 0, octave: 4 })
  assert.deepEqual(nearestNote(detune(261.63, -60), 440), { pitchClass: 11, octave: 3 })
})

test('black keys are named by sharp with their flat', () => {
  assert.deepEqual(noteLabel(0, SPANISH), { name: 'Do' })
  assert.deepEqual(noteLabel(1, SPANISH), { name: 'Do♯', flat: 'Re♭' })
  assert.deepEqual(noteLabel(10, SPANISH), { name: 'La♯', flat: 'Si♭' })
  assert.deepEqual(noteLabel(11, SPANISH), { name: 'Si' })
})
