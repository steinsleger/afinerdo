import { useEffect, useEffectEvent, useState } from 'react'
import { createPitchDetector, windowSizeFor } from './pitch.ts'
import { audioContext } from './tone.ts'

// Voice processing would cancel or flatten the very tone being tuned.
const RAW_AUDIO: MediaTrackConstraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: false }

export type ListenerStatus = 'starting' | 'listening' | 'denied' | 'unavailable'

/** Opens the microphone while mounted and calls `onPitch` every frame with the detected frequency, or null. */
export function useListener(onPitch: (hz: number | null) => void) {
  const [status, setStatus] = useState<ListenerStatus>('starting')
  const onFrame = useEffectEvent(onPitch)

  useEffect(() => {
    let closed = false
    let frame = 0
    let stream: MediaStream | undefined
    let source: MediaStreamAudioSourceNode | undefined

    async function open() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: RAW_AUDIO })
      if (closed) return close()
      stream.getAudioTracks()[0].addEventListener('ended', () => fail('unavailable'))
      const ctx = audioContext()
      const size = windowSizeFor(ctx.sampleRate)
      const analyser = new AnalyserNode(ctx, { fftSize: size })
      source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      const detect = createPitchDetector(size, ctx.sampleRate)
      const samples = new Float32Array(size)
      const tick = () => {
        analyser.getFloatTimeDomainData(samples)
        onFrame(detect(samples))
        frame = requestAnimationFrame(tick)
      }
      setStatus('listening')
      tick()
    }

    function close() {
      cancelAnimationFrame(frame)
      source?.disconnect()
      stream?.getTracks().forEach((track) => track.stop())
    }

    function fail(next: ListenerStatus) {
      close()
      if (!closed) setStatus(next)
    }

    open().catch((error: unknown) =>
      fail(error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'unavailable'),
    )

    return () => {
      closed = true
      close()
    }
  }, [])

  return status
}
