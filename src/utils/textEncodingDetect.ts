// 取り込みファイルの文字コードを判定してテキスト化する。
// Excel の「CSV UTF-8」(BOM付き) / 「Unicode テキスト」(UTF-16LE) / メモ帳の ANSI 保存(Shift_JIS) を想定。

// 先頭の BOM から文字コードを確定できる場合はそのラベルと BOM 長を返す。
const detectBom = (bytes: Uint8Array): { label: string; offset: number } | null => {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
    return { label: 'utf-8', offset: 3 }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return { label: 'utf-16le', offset: 2 }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return { label: 'utf-16be', offset: 2 }
  return null
}

// BOM 無しの場合は UTF-8 として厳密デコードを試し、失敗したら Shift_JIS とみなす。
// 日本語を含む Shift_JIS はまず UTF-8 として不正になるため、艦名リスト用途では実用上誤判定しない。
export const decodeImportedText = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)

  const bom = detectBom(bytes)
  if (bom) return new TextDecoder(bom.label).decode(bytes.subarray(bom.offset))

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder('shift_jis').decode(bytes)
  }
}

// ファイルを文字コード判定込みで読み込む。
export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(decodeImportedText(e.target?.result as ArrayBuffer))
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
