// 特攻表の生成に必要だが shiplist にまだ無いメタ情報。
// shiplist 側に nationality / spGroupId が入ったら、この定義は不要になり削除できる。

// 国籍。艦の「形態(bannerId)」単位で決まる点に注意:
// 呂500(日) と U-511(独) は同じ系統(orig=231)、伊503(日) と C.Cappellini(伊) も同じ系統。
// 「日本SS 1.24x」のような特攻はこの形態単位の国籍で効くため、系統単位では表現できない。

// class 名の前方一致で国籍を決める既定ルール(ここに無ければ JP)
export const NATIONALITY_BY_CLASS = {
  'Atlanta級': 'US', 'Brooklyn級': 'US', 'Casablanca級': 'US', 'Colorado級': 'US',
  'Essex級': 'US', 'Fletcher級': 'US', 'Gato級': 'US', 'Independence級': 'US',
  'Iowa級': 'US', 'JohnC.Butler級': 'US', 'Lexington級': 'US', 'Nevada級': 'US',
  'NewOrleans級': 'US', 'NorthCarolina級': 'US', 'Northampton級': 'US', 'Ranger級': 'US',
  'Salmon級': 'US', 'SouthDakota級': 'US', 'South Dakota級': 'US', 'St.Louis級': 'US',
  'Yorktown級': 'US',
  'ArkRoyal級': 'GB', 'Courageous級': 'GB', 'Glorious級': 'GB', 'Illustrious級': 'GB',
  'J級': 'GB', 'Nelson級': 'GB', 'QueenElizabeth級': 'GB', 'Town級': 'GB',
  'AdmiralHipper級': 'DE', 'Bismarck級': 'DE', 'GrafZeppelin級': 'DE',
  'UボートIXC型': 'DE', 'Z1型': 'DE',
  'Aquila級': 'IT', 'ContediCavour級': 'IT', 'GuglielmoMarconi級': 'IT',
  'L.d.S.D.d.Abruzzi級': 'IT', 'Maestrale級': 'IT', 'Marcello級': 'IT',
  'V.Veneto級': 'IT', 'Zara級': 'IT',
  'C.Teste級': 'FR', 'LaGalissonnière級': 'FR', 'Mogador級': 'FR', 'Richelieu級': 'FR',
  'Гангут級': 'RU', 'Киров級': 'RU', 'Ташкент級': 'RU',
  'DeRuyter級': 'NL', 'Perth級': 'AU', 'Gotland級': 'SE', 'Thonburi級': 'TH', 'Norge級': 'NO',
}

// 改装で国籍が変わる形態、および class から推定できない艦(艦名で指定)。class 由来の既定値より優先する。
export const NATIONALITY_BY_NAME = {
  '呂500': 'JP',      // U-511(独) の日本改装形態
  '伊503': 'JP',      // C.Cappellini(伊) の日本改装形態
  '伊504': 'JP',      // Luigi Torelli(伊) の日本改装形態
  'UIT-24': 'DE',
  'UIT-25': 'DE',
  'Верный': 'JP',     // 響改二。名前はロシア語だが日本艦(暁型)
}

// 特攻グループの分割案。同じ系統(orig)でも形態によって特攻倍率が割れる艦を別行にする。
// 採番は既存の Верный(spGroupId=9147) に倣い 9000 + 代表形態の bannerId で統一する。
//
// legacyId: 過去イベントの maintable に、別の採番で手入力された同じ意味の行があるもの。
// これらは shiplist 側の spGroupId が未設定のため、現状どの艦からも参照されていない(孤立行)。
// 過去イベント行の補完時に、この行の値を引き継ぐ。
//
// key = 新 spGroupId, value.banners = この新グループに属する bannerId
export const SP_GROUP_SPLITS = {
  9058: { label: '北上(雷巡形態)', banners: [58, 119], reason: '改/改二は重雷装巡洋艦。CL特攻が効かない' },
  9057: { label: '大井(雷巡形態)', banners: [57, 118], reason: '改/改二は重雷装巡洋艦。CL特攻が効かない' },
  9108: { label: '千歳(航空形態)', banners: [108, 291, 296], reason: '千歳航以降は軽空母。水母形態とは艦種倍率が違う' },
  9109: { label: '千代田(航空形態)', banners: [109, 292, 297], reason: '千代田航以降は軽空母。水母形態とは艦種倍率が違う' },
  9185: { label: '龍鳳', banners: [185, 318, 883, 888], legacyId: 185, reason: '大鯨は潜水母艦、龍鳳以降は軽空母' },
  9146: { label: '木曾(雷巡形態)', banners: [146, 217], reason: '改/改二は重雷装巡洋艦。CL特攻が効かない' },
  9508: { label: '鈴谷(航空形態)', banners: [508], reason: '鈴谷航改二は軽空母。重巡/航巡形態とは艦種倍率が違う' },
  9509: { label: '熊野(航空形態)', banners: [509], reason: '熊野航改二は軽空母。重巡/航巡形態とは艦種倍率が違う' },
  9507: { label: '三隈(改二特)', banners: [507], reason: '三隈改二特は水上機母艦。重巡/航巡形態とは艦種倍率が違う' },
  9499: { label: '神威(水母形態)', banners: [499], reason: '神威改のみ水上機母艦(神威/神威改母は補給艦)' },
  9741: { label: 'Glorious(航空形態)', banners: [741, 1027], legacyId: 9612, reason: '航形態は空母、戦形態は戦艦' },
  9436: { label: '呂500', banners: [436], reason: '日本SS特攻。U-511形態には効かない' },
  9940: { label: '伊503', banners: [940], reason: '日本SS特攻。C.Cappellini形態には効かない' },
  9535: { label: 'Luigi Torelli', banners: [535, 539, 605], reason: '伊504のみ日本SS特攻。伊504を元グループに残す' },
  // 9147: Верный は Firestore の shiplist に登録済み
}
