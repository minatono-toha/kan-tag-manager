# 特攻表(maintable)の生成

`maintable` の全セルは手入力せず、イベントごとのルール定義から生成する。
2026夏イベの場合、342行 × 10列 = 3,420セルの実体は、出典に書かれている40個ほどの数値と艦名リストだけ。

## 構成

| ファイル | 役割 |
|---|---|
| `data/events/event<N>.rules.mjs` | 倍率ルール。**ここだけ直せば表全体が直る** |
| `data/ship-meta.mjs` | 国籍(形態単位)と特攻グループ分割の定義 |
| `scripts/fetch-master.mjs` | Firestore のマスタを `data/master/` にダンプ(読み取りのみ) |
| `scripts/build-maintable.mjs` | 生成器。`out/` に CSV・投入用JSON・検証レポートを出す |

`out/` と `data/master/` は生成物なので git 管理外。

対地装備(`shiplist.ground_atk`)の生成については後段の「対地装備の生成」を参照。

## 計算モデル

```
セルの値 = (全図の艦種倍率) × (全図のグループ倍率) × (ボス地点の艦種倍率) × (ボス地点のグループ倍率)
```

`maintable` の列(`mapId_N`)は `eventmap` のボス地点に対応する。道中・ギミック地点は列が無いので載せない。
装備由来の特攻(瑞雲系の機数倍率、特四式内火艇など)は艦単位で表現できないため対象外。

## 倍率を修正するとき

```sh
node scripts/fetch-master.mjs          # マスタを最新化
# data/events/event3.rules.mjs の数値を直す
node scripts/build-maintable.mjs 3
```

`out/report.md` の**警告が0件**であることを必ず確認する。警告が出るのは主に次の場合。

- 艦名が shiplist で解決できない
- グループ内に艦種の違う形態が混在し、倍率が割れる(→ `ship-meta.mjs` の `SP_GROUP_SPLITS` で分割)
- 外国艦の国籍が推定できない

Firestore への反映は `D:\src\firebase-maintenance` 経由。**既存行の更新なので、必ず sync してから貼る**
(シートの行に Firestore のドキュメントIDが入っていないと、更新ではなく新規作成になり重複する)。

```sh
cd D:\src\firebase-maintenance
node index.js sync   --collections maintable   # Firestore → シート(ID付きの現在値)
# シートの該当イベント行に out/maintable_event3.csv の値を貼る(orig 列で突き合わせること)
node index.js export --collections maintable   # シート → Firestore
```

## 後段作戦を追加するとき

1. `eventmap` に後段のボス地点を追加する(mapId は既存の続き番号)。
2. `fetch-master.mjs` を実行して eventmap を取り込む。
3. ルール定義に stage を追加する。`nodes[].mapIds` は eventmap の mapId と一致させる。
4. `build-maintable.mjs` を実行。前段の列も同じ値で再生成されるので、表全体をそのまま貼り替えればよい。
5. 上記の sync → 貼り付け → export。

## 検算について

ルール定義の `checks` に、外部の特効表(X投稿の画像など)から読み取った期待値を書いておくと、
生成結果と突き合わせて `out/report.md` に差分が出る。ソース同士の食い違いはここで炙り出す。
**出典(Googleドキュメント)を正とし、画像は検算にのみ使う**方針。

---

# 対地装備(ground_atk)の生成

`shiplist.ground_atk` は**形態(bannerId)単位**の対地装備の可否。艦単位ではないので手入力しない。

| 値 | 意味 | SPA の「対地装備」列 |
|---|---|---|
| 0 | どちらもNG | `-` |
| 1 | 上陸用舟艇のみ可 | `大発系のみ` |
| 2 | 特型内火艇のみ可 | `内火艇のみ` |
| 3 | どちらも可 | `大発系・内火艇OK` |

出典: <https://kannagi35.com/content/kantai-collection-anti-ground>
(出典の WG系・迫撃砲系は本アプリの対象外)

## 構成

| ファイル | 役割 |
|---|---|
| `data/ground-atk.rules.mjs` | 出典の表の転記。**ここだけ直せば全形態の値が直る** |
| `scripts/build-ground-atk.mjs` | 生成器。`out/` に CSV・投入用JSON・レポートを出す |

```sh
node scripts/fetch-master.mjs      # マスタを最新化
node scripts/build-ground-atk.mjs
```

`out/ground_atk_report.md` の**警告が0件**であることを必ず確認する。

## 生成の考え方

出典は「艦名」で書かれているが、可否は改装段階で変わる(秋津洲は素で不可・改で可)。
そのため生成器は次の順で形態(bannerId)に落とす。先に決まった規則が優先される。

1. **出典の表** — `SOURCE_ROWS` の転記。`[上陸用舟艇, 特型内火艇]` で書く。
   「できない」行(`[0,0]`)も残す。確認済みの記録であり、下の継承を止める役割も持つ。
2. **出典の抜けの補完** — `SOURCE_FIXES`。出典に行が無いが装備可能と確認できた形態。
   **出典を直接転記していない唯一の箇所**なのでレポートで必ず確認する。
3. **改装形態への継承** — 出典は「千歳」「あきつ丸」のように基本形しか載せない艦がある。
   同一系統・**同一艦種**で updateLevel が真に大きい形態に引き継ぐ。
   艦種が変わる形態(千歳航=軽空母)は装備可否も変わるため引き継がない。
   分岐改装で可否が割れる形態が出たら `INHERIT_BLOCK` で止める。
4. **艦種一括ルール** — `TYPE_RULES`。出典の本文にあり表に行が無いもの
   (「まるゆを除く全ての潜水艦・潜水空母は特型内火艇を装備できる」)。
5. 残りは 0。

継承した形態と補完した形態はレポートに全件出るので、そこだけ目視すればよい。

## Firestore への反映

既存行への列追加なので、**必ず sync してから貼る**(docId が無いと新規作成になり重複する)。

```sh
cd D:\src\firebase-maintenance
node index.js sync   --collections shiplist   # Firestore → シート(docId付きの現在値)
# シートに ground_atk 列を作り、out/shiplist_ground_atk.csv の値を docId で突き合わせて貼る
node index.js export --collections shiplist   # シート → Firestore
```

## 新しい艦・改装が実装されたとき

shiplist に形態が増えたら `fetch-master.mjs` → `build-ground-atk.mjs` を回す。
出典に載っているのに shiplist に無い艦名は「【艦名未解決】」として警告に出るので、
先に shiplist 側へ形態を追加すること。
