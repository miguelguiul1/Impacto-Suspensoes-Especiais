import { useEffect, useRef, useState } from 'react'

type Values = Record<string, number>

/** Sai do ponto e passa um pouco do alvo antes de assentar, como suspensão. */
function easeOutBack(t: number): number {
  const c1 = 1.35
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/**
 * Anima um conjunto de números até o alvo. Com `instant` (movimento reduzido)
 * troca direto de estado, sem animação.
 */
export function useTween<T extends Values>(target: T, instant: boolean, duration = 560): T {
  const [value, setValue] = useState<T>(target)
  const fromRef = useRef<T>(target)
  const valueRef = useRef<T>(target)
  const key = JSON.stringify(target)

  useEffect(() => {
    const to = JSON.parse(key) as T
    if (instant) {
      valueRef.current = to
      return
    }
    fromRef.current = valueRef.current
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const k = easeOutBack(t)
      const next = {} as Values
      for (const name of Object.keys(to)) next[name] = from[name] + (to[name] - from[name]) * k
      valueRef.current = next as T
      setValue(next as T)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [key, instant, duration])

  return instant ? target : value
}
