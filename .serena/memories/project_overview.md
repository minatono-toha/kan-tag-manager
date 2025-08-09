# プロジェクト概要
Vue 3 + Vite を用いた艦これタグ管理Webアプリ。艦船情報や特攻情報の管理・表示、フィルタリング、Firebase連携などを行う。

## 主な技術スタック
- Vue 3, Pinia, Vue Router
- TypeScript
- Vite, Vitest
- Tailwind CSS
- Firebase, idb
- ESLint, Prettier

## コード構成
- src/assets: CSS等の静的アセット
- src/components: UIコンポーネント
- src/composables: Composition API用のロジック
- src/constants: 定数
- src/database: DB関連
- src/router: ルーティング
- src/stores: Piniaストア
- src/types: 型定義
- src/views: 画面ビュー
- src/App.vue, src/main.ts: エントリポイント

## MCP/Serena設定
- .vscode/mcp.jsonでMCPサーバー設定
- Serena MCPサーバーはuvxコマンドで起動
- GitHub Copilot MCPも利用可能

## 推奨IDE拡張
- Volar, ESLint, Prettier, Vitest Explorer

## 参考コマンド
- npm run dev: 開発サーバー
- npm run build: 本番ビルド
- npm run test:unit: ユニットテスト
- npm run lint: Lint
- npm run format: フォーマット
- npm run deploy: GitHub Pagesデプロイ
