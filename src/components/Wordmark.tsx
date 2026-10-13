import { Todo } from './Todo'

/*
 * Wordmark em texto, provisório. A logo original ainda não está em
 * /public/assets. Não redesenhar nem imitar a logo: quando o arquivo chegar,
 * trocar este componente por <img src="/assets/..." alt="Impacto Suspensões Especiais">.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="block font-cond text-[1.9rem] font-extrabold uppercase leading-[0.8] tracking-tight">
        Impacto
      </span>
      <span className="mt-1 block font-cond text-[0.72rem] font-semibold uppercase leading-none tracking-[0.2em]">
        Suspensões Especiais
      </span>
    </span>
  )
}

export function WordmarkTodo() {
  return <Todo>logo original (arquivo sem o anel do Instagram)</Todo>
}
