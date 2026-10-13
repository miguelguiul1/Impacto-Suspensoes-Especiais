/**
 * Dicas de suspensão: só posts reais, fornecidos pelo cliente (ex.: do
 * @loja.impactoespeciais). Enquanto a lista estiver vazia, a seção não existe.
 */
export type Dica = {
  title: string
  /** Link do post original. */
  url: string
}

export const DICAS: Dica[] = []
