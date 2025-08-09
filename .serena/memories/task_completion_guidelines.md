# タスク完了時の推奨アクション
1. コード変更後は必ず以下を実行:
   - `npm run lint`（ESLintによる静的解析と自動修正）
   - `npm run format`（Prettierによるコード整形）
   - `npm run type-check`（型チェック）
   - `npm run test:unit`（ユニットテスト）
2. 本番反映時は `npm run build` でビルドし、`npm run deploy` でGitHub Pagesへデプロイ
3. 依存追加時は `npm install <package>` を利用
4. MCP/Serenaによる自動解析・リファクタも活用可能
