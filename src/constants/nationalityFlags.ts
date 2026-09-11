// src/constants/nationalityFlags.ts

// 国籍コード(shiplist.nationality, ISO 3166-1 alpha-2 相当)から国旗アイコンの画像URLを引く。
// 絵文字の国旗(リージョナルインジケータ記号)は環境によって文字のまま表示されてしまうため、
// flag-icons パッケージのSVGを直接埋め込む。shiplist に実在するコードのみ列挙する
// (未知のコードが増えたらここに追記する)。
// 艦モーダルでは国名は当時の国名(nationalityNames.ts)で表示するが、
// 国旗アイコン自体は現在の国旗をそのまま使う。
import flagAU from 'flag-icons/flags/4x3/au.svg'
import flagDE from 'flag-icons/flags/4x3/de.svg'
import flagFR from 'flag-icons/flags/4x3/fr.svg'
import flagGB from 'flag-icons/flags/4x3/gb.svg'
import flagIT from 'flag-icons/flags/4x3/it.svg'
import flagJP from 'flag-icons/flags/4x3/jp.svg'
import flagNL from 'flag-icons/flags/4x3/nl.svg'
import flagNO from 'flag-icons/flags/4x3/no.svg'
import flagRU from 'flag-icons/flags/4x3/ru.svg'
import flagSE from 'flag-icons/flags/4x3/se.svg'
import flagTH from 'flag-icons/flags/4x3/th.svg'
import flagUS from 'flag-icons/flags/4x3/us.svg'

export const NATIONALITY_FLAG_SRC: Record<string, string> = {
  AU: flagAU, DE: flagDE, FR: flagFR, GB: flagGB, IT: flagIT, JP: flagJP,
  NL: flagNL, NO: flagNO, RU: flagRU, SE: flagSE, TH: flagTH, US: flagUS,
}

export const nationalityFlagSrc = (code?: string): string | undefined =>
  code ? NATIONALITY_FLAG_SRC[code] : undefined
