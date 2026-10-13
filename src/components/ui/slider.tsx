import * as SliderPrimitive from '@radix-ui/react-slider'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/*
 * Slider do shadcn/ui (Radix por baixo, pela acessibilidade: teclado, setas,
 * Home/End, PageUp/PageDown e leitor de tela). Visual todo refeito: o trilho
 * é o corpo rosqueado de um coilover e o cursor é o anel de regulagem.
 */
type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabel: string
  thumbValueText?: string
}

export function Slider({ className, thumbLabel, thumbValueText, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex touch-none select-none items-center',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-12 data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative w-3 grow border-2 border-ink bg-[repeating-linear-gradient(to_bottom,rgb(var(--c-ink))_0_2px,transparent_2px_6px)]">
        <SliderPrimitive.Range className="absolute w-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={thumbLabel}
        aria-valuetext={thumbValueText}
        className={cn(
          'block h-7 w-12 cursor-grab border-[3px] border-ink bg-red active:cursor-grabbing',
          'shadow-[inset_0_-6px_0_rgb(var(--c-ink)/0.25)]',
          'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-ink',
        )}
      />
    </SliderPrimitive.Root>
  )
}
