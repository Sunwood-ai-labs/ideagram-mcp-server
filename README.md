<div align="center">
<img src="assets/header-animation.svg" width="100%">

# 🎨 Ideogram MCP Server

<p align="center">
<img alt="GitHub" src="https://img.shields.io/github/license/sunwood-ai-labs/ideagram-mcp-server">
<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/sunwood-ai-labs/ideagram-mcp-server">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/sunwood-ai-labs/ideagram-mcp-server">
<img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/sunwood-ai-labs/ideagram-mcp-server">
<img alt="npm" src="https://img.shields.io/npm/v/@sunwood-ai-labs/ideagram-mcp-server">
<img alt="npm" src="https://img.shields.io/npm/dt/@sunwood-ai-labs/ideagram-mcp-server">
</p>

<a href="https://glama.ai/mcp/servers/xzcx34d305">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/xzcx34d305/badge" alt="Ideogram Server MCP server" />
</a>

Ideogram APIを使用して画像生成機能を提供するModel Context Protocol (MCP) サーバー

</div>


https://github.com/user-attachments/assets/041553d3-6fbc-4dfa-b149-d195dcb9e8f8



## 📋 機能

- プロンプトに基づく画像生成
- カスタマイズ可能なパラメータ
  - アスペクト比
  - モデル選択
  - マジックプロンプト
  - スタイルタイプ
  - ネガティブプロンプト
  - 生成画像数

## 🚀 セットアップ

1. 必要な依存関係をインストール:
```bash
npm install
```

2. 環境変数の設定:
`.env`ファイルを作成し、以下の内容を追加:
```env
IDEOGRAM_API_KEY=your_api_key_here
```

3. ビルド:
```bash
npm run build
```

4. （オプション）グローバルにインストール:
```bash
npm link
```

## 💻 使用方法

### MCPツール

#### generate_image

画像を生成するためのツール。

**必須パラメータ:**
- `prompt`: 画像生成に使用するプロンプト

**オプションパラメータ:**
- `aspect_ratio`: 画像のアスペクト比
  - `ASPECT_1_1`
  - `ASPECT_4_3`
  - `ASPECT_3_4`
  - `ASPECT_16_9`
  - `ASPECT_9_16`
- `model`: 使用するモデル
  - `V_1`
  - `V_1_TURBO`
  - `V_2`
  - `V_2_TURBO`
- `magic_prompt_option`: マジックプロンプトの設定
  - `AUTO`
  - `ON`
  - `OFF`
- `style_type`: 生成スタイル
- `negative_prompt`: 除外したい要素の説明
- `num_images`: 生成する画像の数（1-8）

### 使用例

```typescript
const result = await use_mcp_tool({
  server_name: "ideagram-mcp-server",
  tool_name: "generate_image",
  arguments: {
    prompt: "A beautiful sunset over mountains",
    aspect_ratio: "ASPECT_16_9",
    model: "V_2",
    num_images: 1
  }
});
```

## 🔧 開発

### ディレクトリ構造

```
ideagram-mcp-server/
├── src/
│   ├── index.ts          # メインのサーバーコード
│   └── ideogram-client.ts # Ideogram APIクライアント
├── package.json
├── tsconfig.json
└── README.md
```

### スクリプト

- `npm run build`: TypeScriptのコンパイル
- `npm run watch`: 開発モードでの実行（ファイル変更の監視）
- `npm run lint`: コードのリント
- `npm test`: テストの実行

## 📄 ライセンス

MIT

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m '✨ feat: Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成