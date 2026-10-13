import { useId } from 'react'

/*
 * Carro genérico de perfil, desenhado à mão em SVG.
 * Sem marca, sem modelo reconhecível, sem número, placa ou patrocinador.
 * As rodas ficam no chão; só a carroceria sobe e desce (offset), e a mola
 * visível no vão do paralama estica ou encolhe junto.
 */

const GROUND = 318
const WHEEL_Y = 262
const TIRE_R = 56
const ARCH_R = 78
const WHEELS = [190, 610] as const
/** Topo do teto no desenho original (faixa 2). */
const ROOF_TOP = 95

type Props = {
  /** Deslocamento vertical da carroceria em px do desenho. Negativo = sobe. */
  offset: number
  /** Inclinação da carroceria em graus. */
  tilt?: number
  /** Mostra linha de referência e cota de altura total. */
  annotate?: boolean
  /** Linhas de velocidade (seção Track Day). */
  speed?: boolean
  className?: string
  title?: string
}

function springPath(cx: number, top: number, bottom: number, coils = 6): string {
  const h = bottom - top
  const step = h / (coils * 2)
  const half = 15
  let d = `M ${cx} ${top} L ${cx - half} ${top + step * 0.5}`
  for (let i = 1; i < coils * 2; i++) {
    const x = i % 2 === 1 ? cx + half : cx - half
    d += ` L ${x} ${top + step * (i + 0.5)}`
  }
  d += ` L ${cx} ${bottom}`
  return d
}

function Wheel({ cx }: { cx: number }) {
  const spokes = [0, 72, 144, 216, 288]
  return (
    <g>
      <circle cx={cx} cy={WHEEL_Y} r={TIRE_R} className="fill-paper stroke-ink" strokeWidth={5} />
      <circle cx={cx} cy={WHEEL_Y} r={44} fill="none" className="stroke-ink" strokeWidth={1.6} />
      <circle cx={cx} cy={WHEEL_Y} r={35} fill="none" className="stroke-ink" strokeWidth={3} />
      <circle cx={cx} cy={WHEEL_Y} r={7} className="fill-ink" />
      {spokes.map((a) => {
        const r = (a * Math.PI) / 180
        return (
          <line
            key={a}
            x1={cx + Math.cos(r) * 11}
            y1={WHEEL_Y + Math.sin(r) * 11}
            x2={cx + Math.cos(r + 0.12) * 32}
            y2={WHEEL_Y + Math.sin(r + 0.12) * 32}
            className="stroke-ink"
            strokeWidth={3.2}
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

const BODY =
  'M 58 262 C 49 245, 50 221, 64 206 C 121 195, 221 187, 302 180 C 341 151, 381 119, 421 104 ' +
  'C 481 93, 561 92, 618 102 C 661 125, 701 152, 734 174 C 748 183, 753 197, 750 214 L 748 246 ' +
  'C 746 257, 740 262, 727 262 L 688 262 A 78 78 0 0 0 532 262 L 268 262 A 78 78 0 0 0 112 262 Z'

export function CarSketch({ offset, tilt = 0, annotate = true, speed = false, className, title }: Props) {
  const uid = useId().replace(/:/g, '')
  const rough = `rough-${uid}`
  const titleId = `car-title-${uid}`
  const archTop = WHEEL_Y - ARCH_R + offset
  const roofTop = ROOF_TOP + offset

  return (
    <svg
      viewBox="0 28 800 324"
      className={className}
      role={title ? 'img' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title id={titleId}>{title}</title>}
      <defs>
        <filter id={rough} x="-4%" y="-8%" width="108%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {speed && (
        <g className="stroke-sky" strokeWidth={6} strokeLinecap="round">
          <line x1={0} y1={150} x2={40} y2={150} />
          <line x1={-10} y1={190} x2={36} y2={190} />
          <line x1={4} y1={232} x2={34} y2={232} />
        </g>
      )}

      {/* chão com hachura */}
      <g filter={`url(#${rough})`}>
        <line x1={14} y1={GROUND} x2={786} y2={GROUND} className="stroke-ink" strokeWidth={4} strokeLinecap="round" />
        {Array.from({ length: 38 }, (_, i) => (
          <line
            key={i}
            x1={30 + i * 20}
            y1={GROUND + 4}
            x2={18 + i * 20}
            y2={GROUND + 18}
            className="stroke-ink"
            strokeWidth={1.4}
            opacity={0.55}
          />
        ))}
      </g>

      {annotate && (
        <g className="text-muted" aria-hidden="true">
          <line
            x1={300}
            y1={ROOF_TOP}
            x2={760}
            y2={ROOF_TOP}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeDasharray="7 6"
          />
          <text x={700} y={ROOF_TOP - 8} className="fill-muted font-cond" fontSize={18} fontWeight={600}>
            ORIGINAL
          </text>
        </g>
      )}

      {/* molas no vão do paralama: presas na roda embaixo, na carroceria em cima */}
      <g filter={`url(#${rough})`}>
        {WHEELS.map((cx) => (
          <path
            key={cx}
            d={springPath(cx, archTop + 2, WHEEL_Y - 8)}
            fill="none"
            className="stroke-red"
            strokeWidth={4}
            strokeLinejoin="round"
          />
        ))}
        {WHEELS.map((cx) => (
          <Wheel key={cx} cx={cx} />
        ))}
      </g>

      {/* carroceria */}
      <g transform={`translate(0 ${offset}) rotate(${tilt} 400 ${WHEEL_Y})`}>
        <g filter={`url(#${rough})`} strokeLinecap="round" strokeLinejoin="round">
          <path d={BODY} className="fill-paper stroke-ink" strokeWidth={5.5} />
          <path
            d={BODY}
            fill="none"
            className="stroke-ink"
            strokeWidth={1.4}
            opacity={0.45}
            transform="translate(2.5 -2)"
          />
          {/* vidro lateral */}
          <path
            d="M 336 176 C 366 150, 396 128, 426 116 C 482 106, 556 106, 602 115 C 632 134, 656 150, 680 168 Z"
            className="fill-paper-2 stroke-ink"
            strokeWidth={3.5}
          />
          <line x1={512} y1={109} x2={514} y2={176} className="stroke-ink" strokeWidth={7} />
          {/* portas, frisos, maçanetas */}
          <path d="M 324 181 C 322 210, 323 236, 326 258" fill="none" className="stroke-ink" strokeWidth={2.5} />
          <path d="M 520 176 C 522 205, 521 232, 520 258" fill="none" className="stroke-ink" strokeWidth={2.5} />
          <path d="M 72 223 C 300 214, 560 206, 742 200" fill="none" className="stroke-ink" strokeWidth={1.6} />
          <path d="M 270 250 L 530 251" fill="none" className="stroke-ink" strokeWidth={2} />
          <line x1={438} y1={197} x2={470} y2={196} className="stroke-ink" strokeWidth={4} />
          <line x1={598} y1={192} x2={626} y2={191} className="stroke-ink" strokeWidth={4} />
          {/* farol, lanterna, retrovisor */}
          <path
            d="M 66 209 C 92 203, 118 201, 140 203 L 133 214 C 109 216, 87 218, 68 220 Z"
            className="fill-paper stroke-ink"
            strokeWidth={2.5}
          />
          <path d="M 737 180 L 749 188 L 750 206 L 739 206 Z" className="fill-red stroke-ink" strokeWidth={2} />
          <path
            d="M 422 152 C 410 146, 398 148, 396 158 L 420 161 Z"
            className="fill-paper stroke-ink"
            strokeWidth={2.5}
          />
        </g>
      </g>

      {annotate && (
        <g className="text-ink" aria-hidden="true">
          {/* cota de altura total */}
          <line x1={640} y1={roofTop} x2={790} y2={roofTop} stroke="currentColor" strokeWidth={1} />
          <line x1={778} y1={roofTop + 3} x2={778} y2={GROUND - 3} stroke="currentColor" strokeWidth={1.5} />
          <path
            d={`M 772 ${roofTop + 12} L 778 ${roofTop + 1} L 784 ${roofTop + 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <path
            d={`M 772 ${GROUND - 12} L 778 ${GROUND - 1} L 784 ${GROUND - 12}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <text
            x={769}
            y={(roofTop + GROUND) / 2 + 8}
            className="fill-ink font-cond"
            fontSize={22}
            fontWeight={700}
            textAnchor="end"
          >
            H
          </text>
        </g>
      )}
    </svg>
  )
}
