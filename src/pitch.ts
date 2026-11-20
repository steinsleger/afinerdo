// McLeod Pitch Method: the normalized square difference function (NSDF) is computed from an autocorrelation done
// with FFTs, and the pitch is the first key maximum close enough to the highest one.

const MIN_RMS = 0.004
const MIN_CLARITY = 0.9
const KEY_MAXIMUM_THRESHOLD = 0.93

function createFft(size: number) {
  const levels = Math.log2(size)
  if (!Number.isInteger(levels)) throw new Error(`FFT size must be a power of two, got ${size}`)
  const cos = Float64Array.from({ length: size / 2 }, (_, i) => Math.cos((2 * Math.PI * i) / size))
  const sin = Float64Array.from({ length: size / 2 }, (_, i) => Math.sin((2 * Math.PI * i) / size))
  const reversed = Uint32Array.from({ length: size }, (_, i) => {
    let bits = 0
    for (let level = 0; level < levels; level++) bits = (bits << 1) | ((i >> level) & 1)
    return bits
  })

  return function fft(re: Float64Array, im: Float64Array) {
    for (let i = 0; i < size; i++) {
      const j = reversed[i]
      if (j > i) {
        ;[re[i], re[j]] = [re[j], re[i]]
        ;[im[i], im[j]] = [im[j], im[i]]
      }
    }
    for (let span = 2; span <= size; span *= 2) {
      const half = span / 2
      const stride = size / span
      for (let start = 0; start < size; start += span) {
        for (let k = 0; k < half; k++) {
          const a = start + k
          const b = a + half
          const c = cos[k * stride]
          const s = sin[k * stride]
          const tre = re[b] * c + im[b] * s
          const tim = im[b] * c - re[b] * s
          re[b] = re[a] - tre
          im[b] = im[a] - tim
          re[a] += tre
          im[a] += tim
        }
      }
    }
  }
}

function keyMaxima(nsdf: Float64Array) {
  const maxima: number[] = []
  let lag = 0
  while (lag < nsdf.length && nsdf[lag] > 0) lag++
  while (lag < nsdf.length) {
    while (lag < nsdf.length && nsdf[lag] <= 0) lag++
    let peak = lag
    while (lag < nsdf.length && nsdf[lag] > 0) {
      if (nsdf[lag] > nsdf[peak]) peak = lag
      lag++
    }
    if (peak > 0 && peak < nsdf.length - 1) maxima.push(peak)
  }
  return maxima
}

function interpolatePeak(nsdf: Float64Array, peak: number) {
  const [before, at, after] = [nsdf[peak - 1], nsdf[peak], nsdf[peak + 1]]
  const curvature = before - 2 * at + after
  const offset = curvature === 0 ? 0 : (0.5 * (before - after)) / curvature
  return { lag: peak + offset, clarity: at - 0.25 * (before - after) * offset }
}

const MAX_ANALYSER_SIZE = 32768

/** The power of two that holds 1/12 s, two periods of anything above 24 Hz, capped at the largest AnalyserNode size. */
export const windowSizeFor = (sampleRate: number) =>
  Math.min(2 ** Math.ceil(Math.log2(sampleRate / 12)), MAX_ANALYSER_SIZE)

/** Returns a function that finds the frequency of a buffer of `size` samples, or null when it has no clear pitch. */
export function createPitchDetector(size: number, sampleRate: number) {
  const padded = 2 * size
  const fft = createFft(padded)
  const re = new Float64Array(padded)
  const im = new Float64Array(padded)
  const nsdf = new Float64Array(size / 2)
  const centered = new Float64Array(size)

  return function detect(samples: Float32Array): number | null {
    // A DC offset correlates with itself at every lag and would hide the period.
    let mean = 0
    for (let i = 0; i < size; i++) mean += samples[i]
    mean /= size
    let energy = 0
    for (let i = 0; i < size; i++) {
      centered[i] = samples[i] - mean
      energy += centered[i] ** 2
    }
    if (Math.sqrt(energy / size) < MIN_RMS) return null

    re.fill(0)
    im.fill(0)
    re.set(centered)
    fft(re, im)
    for (let i = 0; i < padded; i++) {
      re[i] = re[i] ** 2 + im[i] ** 2
      im[i] = 0
    }
    fft(re, im)

    let squares = 2 * energy
    for (let lag = 0; lag < nsdf.length; lag++) {
      if (lag > 0) squares -= centered[lag - 1] ** 2 + centered[size - lag] ** 2
      nsdf[lag] = squares > 0 ? (2 * re[lag]) / padded / squares : 0
    }

    const maxima = keyMaxima(nsdf)
    if (maxima.length === 0) return null
    const threshold = KEY_MAXIMUM_THRESHOLD * Math.max(...maxima.map((peak) => nsdf[peak]))
    const { lag, clarity } = interpolatePeak(nsdf, maxima.find((peak) => nsdf[peak] >= threshold)!)
    return clarity < MIN_CLARITY ? null : sampleRate / lag
  }
}
