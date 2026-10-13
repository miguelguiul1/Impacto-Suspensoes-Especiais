import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildWhatsAppUrl, normalizeBrPhone, sanitizeMessage } from './whatsapp.ts'

test('aceita só número brasileiro com DDI', () => {
  assert.equal(normalizeBrPhone('+55 (11) 91234-5678'), '5511912345678')
  assert.equal(normalizeBrPhone('551156665036'), '551156665036')
  assert.equal(normalizeBrPhone('11912345678'), null)
  assert.equal(normalizeBrPhone('abc'), null)
})

test('limpa mensagem', () => {
  assert.equal(sanitizeMessage('  oi\n\tmundo  '), 'oi mundo')
  assert.equal(sanitizeMessage('x'.repeat(900)).length, 500)
})

test('codifica tudo que entra na URL', () => {
  const url = buildWhatsAppUrl('5511912345678', 'Olá & <script>?a=1#b')
  assert.equal(url, 'https://wa.me/5511912345678?text=Ol%C3%A1%20%26%20%3Cscript%3E%3Fa%3D1%23b')
  assert.equal(buildWhatsAppUrl('123', 'oi'), null)
  assert.equal(buildWhatsAppUrl('5511912345678', '   '), null)
})
