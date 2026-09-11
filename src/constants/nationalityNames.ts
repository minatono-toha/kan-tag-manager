// src/constants/nationalityNames.ts

// shiplist.nationality(ISO 3166-1 alpha-2 相当のコード)を、艦モーダル表示用の
// 当時の国名に変換する対応表。艦船一覧の国旗列(国コードそのもの)とは表示目的が異なるため、
// この対応表はここだけで独立管理する。
export const NATIONALITY_NAMES: Record<string, string> = {
  JP: '大日本帝国',
  US: 'アメリカ合衆国',
  GB: '大英帝国',
  DE: 'ドイツ国',
  IT: 'イタリア王国',
  FR: 'フランス共和国',
  RU: 'ソビエト連邦',
  NL: 'オランダ王国',
  NO: 'ノルウェー王国',
  SE: 'スウェーデン王国',
  TH: 'タイ王国',
  AU: 'オーストラリア連邦',
}

// 未知のコードは、対応表に無いままコードを出すよりは元のコードを表示する。
export const nationalityName = (code?: string): string =>
  (code && NATIONALITY_NAMES[code]) || code || '-'
