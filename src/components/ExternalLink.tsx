import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { NewTab } from './Arrow'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & { href: string; children: ReactNode }

/** Link para fora do site: sempre nova aba com rel="noopener noreferrer". */
export function ExternalLink({ children, ...rest }: Props) {
  return (
    <a {...rest} target="_blank" rel="noopener noreferrer">
      {children}
      <NewTab />
    </a>
  )
}
