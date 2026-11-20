import { useLayoutEffect } from 'react'

const LEVEL = 0.4
const RAMP_SECONDS = 0.015

declare global {
  interface Navigator {
    audioSession?: { type: 'auto' | 'playback' }
  }
}

let context: AudioContext | undefined
let voice: { oscillator: OscillatorNode; gain: GainNode } | undefined

// Safari plays Web Audio as ambient sound, which the silent switch mutes, unless the page asks for playback.
// Back on auto, it switches to recording when the microphone opens.
function setAudioSession(type: 'auto' | 'playback') {
  if (navigator.audioSession) navigator.audioSession.type = type
}

// Created on first use, so importing this module needs no Web Audio.
export const audioContext = () => (context ??= new AudioContext())

/** Must run inside a user gesture, or iOS keeps the context silent. */
export function unlockAudio() {
  void audioContext().resume()
}

const FADE_MS = RAMP_SECONDS * 4 * 1000

/** Fades the tone out and lets the audio output sleep while the page is hidden. The next `unlockAudio()` wakes it. */
export function suspendAudio() {
  stopTone()
  // Suspending stops the output at once, which clicks mid-tone, so it waits for the fade. If the page came back
  // in the meantime, the audio stays awake.
  setTimeout(() => {
    if (document.hidden) void context?.suspend()
  }, FADE_MS)
}

// A sine keeps its phase when its frequency jumps, so changing notes needs no fade.
function playTone(hz: number) {
  const ctx = audioContext()
  if (voice) {
    voice.oscillator.frequency.setValueAtTime(hz, ctx.currentTime)
    return
  }
  setAudioSession('playback')
  const oscillator = new OscillatorNode(ctx, { frequency: hz })
  const gain = new GainNode(ctx, { gain: 0 })
  oscillator.connect(gain).connect(ctx.destination)
  gain.gain.setTargetAtTime(LEVEL, ctx.currentTime, RAMP_SECONDS / 3)
  oscillator.start()
  voice = { oscillator, gain }
}

function stopTone() {
  if (!voice || !context) return
  const { oscillator, gain } = voice
  gain.gain.setTargetAtTime(0, context.currentTime, RAMP_SECONDS / 3)
  oscillator.stop(context.currentTime + RAMP_SECONDS * 4)
  voice = undefined
  setAudioSession('auto')
}

/** Keeps a sine sounding at `hz`, or silent when it is null. */
export function useTone(hz: number | null) {
  // Layout effects run before any child's effect, so the tone and its playback session end before the meter opens the microphone.
  useLayoutEffect(() => (hz === null ? stopTone() : playTone(hz)), [hz])
  useLayoutEffect(() => stopTone, [])
}
