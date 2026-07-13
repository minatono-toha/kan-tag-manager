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
