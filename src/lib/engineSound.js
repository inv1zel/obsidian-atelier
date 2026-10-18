// Синтез звука запуска двигателя через Web Audio API — без аудиофайлов.
// Реле → стартер → схватывание → перегазовка → холостые.

export function playEngineStart() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return () => {}
  const ctx = new AC()
  const t0 = ctx.currentTime + 0.05

  const master = ctx.createGain()
  master.gain.value = 0.55
  const comp = ctx.createDynamicsCompressor()
  master.connect(comp).connect(ctx.destination)

  const noiseBuffer = (() => {
    const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = b.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return b
  })()
  const noise = () => {
    const n = ctx.createBufferSource()
    n.buffer = noiseBuffer
    n.loop = true
    return n
  }

  // 1. щелчок реле
  {
    const n = noise()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 2500
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.6, t0 + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05)
    n.connect(hp).connect(g).connect(master)
    n.start(t0)
    n.stop(t0 + 0.08)
  }

  // 2. стартер — «вжжж-вжжж»
  const tStart = t0 + 0.35
  const tCatch = tStart + 0.85
  {
    const n = noise()
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 700
    bp.Q.value = 1.4
    const g = ctx.createGain()
    g.gain.value = 0
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 8.5
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.12
    lfo.connect(lfoGain).connect(g.gain)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, tStart)
    env.gain.exponentialRampToValueAtTime(1, tStart + 0.06)
    env.gain.setValueAtTime(1, tCatch - 0.05)
    env.gain.exponentialRampToValueAtTime(0.0001, tCatch + 0.12)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = 34
    const og = ctx.createGain()
    og.gain.value = 0.08
    osc.connect(og).connect(g)
    g.gain.setValueAtTime(0.14, tStart)
    n.connect(bp).connect(g).connect(env).connect(master)
    ;[n, lfo, osc].forEach((s) => {
      s.start(tStart)
      s.stop(tCatch + 0.2)
    })
  }

  // 3. двигатель
  const tEnd = tCatch + 3.6
  {
    const shaper = ctx.createWaveShaper()
    const curve = new Float32Array(1024)
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1
      curve[i] = Math.tanh(x * 3)
    }
    shaper.curve = curve

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.Q.value = 3
    lp.frequency.setValueAtTime(260, tCatch)
    lp.frequency.exponentialRampToValueAtTime(1400, tCatch + 0.35)
    lp.frequency.exponentialRampToValueAtTime(380, tCatch + 1.4)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, tCatch)
    env.gain.exponentialRampToValueAtTime(0.9, tCatch + 0.08)
    env.gain.setValueAtTime(0.9, tCatch + 0.4)
    env.gain.exponentialRampToValueAtTime(0.45, tCatch + 1.4)
    env.gain.setValueAtTime(0.45, tEnd - 1.4)
    env.gain.exponentialRampToValueAtTime(0.0001, tEnd)

    // частота «вспышек» цилиндров: схватывание → перегазовка → холостые
    const freq = (p) => {
      p.setValueAtTime(30, tCatch)
      p.exponentialRampToValueAtTime(48, tCatch + 0.1)
      p.exponentialRampToValueAtTime(118, tCatch + 0.38)
      p.exponentialRampToValueAtTime(52, tCatch + 1.3)
      p.setValueAtTime(52, tEnd)
    }
    const mk = (type, mult, gain) => {
      const o = ctx.createOscillator()
      o.type = type
      freq(o.frequency)
      o.detune.value = 1200 * Math.log2(mult)
      const g = ctx.createGain()
      g.gain.value = gain
      o.connect(g).connect(shaper)
      o.start(tCatch)
      o.stop(tEnd)
      return o
    }
    mk('sawtooth', 1, 0.5)
    mk('square', 0.5, 0.35) // суб-октава
    mk('sawtooth', 1.007, 0.3)

    // неравномерность работы — лёгкий «рокот»
    const rumble = ctx.createOscillator()
    rumble.frequency.value = 11
    const rg = ctx.createGain()
    rg.gain.value = 0.18
    const am = ctx.createGain()
    am.gain.value = 0.82
    rumble.connect(rg).connect(am.gain)
    rumble.start(tCatch)
    rumble.stop(tEnd)

    const exhaust = noise()
    const ebp = ctx.createBiquadFilter()
    ebp.type = 'lowpass'
    ebp.frequency.value = 500
    const eg = ctx.createGain()
    eg.gain.value = 0.12
    exhaust.connect(ebp).connect(eg).connect(shaper)
    exhaust.start(tCatch)
    exhaust.stop(tEnd)

    shaper.connect(lp).connect(am).connect(env).connect(master)
  }

  const timer = setTimeout(() => ctx.close().catch(() => {}), (tEnd - ctx.currentTime + 0.3) * 1000)
  return () => {
    clearTimeout(timer)
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
    setTimeout(() => ctx.close().catch(() => {}), 600)
  }
}
