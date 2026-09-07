# quiz-app

## 概要
一般常識を題材にしたクイズアプリです。

## GitHubリポジトリ
https://github.com/yuichiroshindo/quiz-app.git

## 技術スタック
- HTML
- CSS
- JavaScript

## ディレクトリ構成
```
.
├── index.html
├── style.css
├── script.js
├── server.js
├── .env.example
├── .gitignore
└── CLAUDE.md
```

## 開発方針
- フレームワークは使用せず、素の HTML/CSS/JavaScript で実装する。
- クイズの出題、回答判定、スコア表示をわかりやすく保つ。
- ファイル構成はシンプルに保ち、変更範囲を必要最小限にする。
- ブラウザの開発者ツールで動作確認する。
- OpenWeatherMap APIキーは `.env` の `OPENWEATHER_API_KEY` で管理し、コードへ直書きしない。

## 実行方法
- `.env.example` を `.env` にコピーし、OpenWeatherMap APIキーを設定する。
- `node server.js` を実行し、`http://localhost:3000` をブラウザで開く。
- APIサーバーを使わない場合は `index.html` を直接開けるが、天気情報は取得できない。

## コーディング規約
- コメントは日本語で書く。
- 変数名と関数名は英語のキャメルケース（例：`currentQuestion`）を使う。
- 既存の HTML、CSS、JavaScript の構成と記法を優先する。

## 返答ルール
- 返答は必ず日本語で行う。

## 禁止事項
- `rm -rf` コマンドは絶対に実行しない。
- `package.json` の依存パッケージを無断で変更しない。
- データベースへの削除操作（DELETE 文）を実行しない。