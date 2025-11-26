//expressを立ち上げて、簡単なAPIを作成する
const express = require('express');
const app = express();
const port = 3000;

// ミドルウェアの設定
app.use(express.json()); // JSONボディのパース

// 簡単なAPIエンドポイントの作成
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is healthy' });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});