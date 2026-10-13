import { useEffect, useRef, useState } from 'react'

/** 1 mm em px CSS (96 px = 25,4 mm). */
const MM = 96 / 25.4
const fmt = new Intl.NumberFormat('pt-BR')

/*
 * Régua vertical de verdade, em mm, presa à página: ela rola junto com o
 * conteúdo e um ponteiro fixo no meio da tela lê a medida. Não tem animação
 * própria — só acompanha a rolagem, então vale também com movimento reduzido.
 */
export function ScrollRuler() {
  const [pageH, setPageH] = useState(0)
  const readout = useRef<HTMLSpanElement>(null)
  const ruler = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ruler.current
    const ro = new ResizeObserver(() => setPageH(el?.offsetHeight ?? 0))
    if (el) ro.observe(el)

    let raf = 0
    const update = () => {
      raf = 0
      const top = (el?.getBoundingClientRect().top ?? 0) + window.scrollY
      const mm = Math.max(0, Math.round((window.scrollY + window.innerHeight / 2 - top) / MM))
      if (readout.current) readout.current.textContent = fmt.format(mm)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const labels = Array.from({ length: Math.floor((pageH - 12) / (MM * 50)) }, (_, i) => (i + 1) * 50)

  return (
    <div aria-hidden="true">
      <div
        ref={ruler}
        className="ruler absolute inset-y-0 left-0 w-ruler overflow-hidden border-r-2 border-ink bg-paper-2"
      >
        <div className="hidden md:block">
          {labels.map((mm) => (
            <span
              key={mm}
              className="num absolute left-1 -translate-y-1/2 bg-paper-2 font-cond text-[11px] font-semibold leading-none"
              style={{ top: mm * MM }}
            >
              {mm}
            </span>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed left-0 top-1/2 z-20 flex w-ruler -translate-y-1/2 flex-col items-stretch">
        <span className="block h-[3px] w-[calc(var(--ruler-w)+10px)] bg-red" />
        <span className="mt-1 hidden bg-red px-0.5 py-0.5 text-center font-cond text-[11px] font-bold leading-tight text-paper md:block">
          <span ref={readout} className="num block">
            0
          </span>
          mm
        </span>
      </div>
    </div>
  )
}
