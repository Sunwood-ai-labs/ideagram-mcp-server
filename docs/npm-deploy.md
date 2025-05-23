# NPM自動デプロイのための設定

## NPMトークン発行方法

1. NPMアカウントにログイン後、右上のプロフィールから「Access Tokens」を選択
2. 「Generate New Token」をクリック
3. トークンタイプとして「Automation」を選択（これにより2段階認証をバイパス可能）
4. 必要に応じてトークンの説明と期限を設定
5. 「Generate Token」をクリックして作成
6. 表示されたトークンを安全な場所にコピー（この画面を閉じると二度と見れないため注意）

## GitHubリポジトリの設定

1. リポジトリの「Settings」→「Secrets and variables」→「Actions」を選択
2. 「New repository secret」をクリック
3. 名前を「NPM_TOKEN」に設定し、値に先ほどコピーしたトークンを貼り付け
4. 「Add secret」をクリックして保存

## パッケージ公開方法の選択

GitHub Actionsでの公開トリガーには以下の選択肢があります：
- ブランチへのプッシュ（例：mainブランチへのプッシュ時に公開）
- タグの作成（例：v1.0.0などのタグが作成された時に公開）
- リリースの作成（例：GitHubでリリースが作成された時に公開）
- コミットメッセージパターン（例：「Release v1.0.0」などのメッセージを含むコミット時に公開）

最も推奨されるのは「タグベース」または「リリースベース」の公開方法です。これにより、意図しない公開を防ぎ、バージョン管理が容易になります。
