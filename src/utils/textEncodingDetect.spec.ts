import { describe, it, expect } from 'vitest'
import { decodeImportedText } from './textEncodingDetect'

const toBuffer = (bytes: number[]): ArrayBuffer => new Uint8Array(bytes).buffer

describe('decodeImportedText', () => {
  it('BOM 無し UTF-8 をそのまま読める', () => {
    const bytes = Array.from(new TextEncoder().encode('島風\n雪風'))
    expect(decodeImportedText(toBuffer(bytes))).toBe('島風\n雪風')
  })

  it('BOM 付き UTF-8 の BOM を取り除く', () => {
    const bytes = [0xef, 0xbb, 0xbf, ...new TextEncoder().encode('島風')]
    expect(decodeImportedText(toBuffer(bytes))).toBe('島風')
  })

  it('UTF-16LE (BOM 付き) を読める', () => {
    // FF FE + "島風"
    const bytes = [0xff, 0xfe, 0xf6, 0x5c, 0xa8, 0x98]
    expect(decodeImportedText(toBuffer(bytes))).toBe('島風')
  })

  it('Shift_JIS にフォールバックする', () => {
    // 「島風」= 93 87 95 97 (UTF-8 としては不正)
    expect(decodeImportedText(toBuffer([0x93, 0x87, 0x95, 0x97]))).toBe('島風')
  })

  it('ASCII のみのファイルは UTF-8 として読む', () => {
    expect(decodeImportedText(toBuffer([0x61, 0x2c, 0x62]))).toBe('a,b')
  })
})
