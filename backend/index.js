//expressを立ち上げて、簡単なAPIを作成する
const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const Dayplan  = require('./models/Dayplan');


// ミドルウェアの設定
app.use(express.json()); // JSONボディのパース
app.use(cors()); // CORSの設定

// MongoDBの接続
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB')
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});



// 簡単なAPIエンドポイントの作成
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is healthy' });
});

app.post('/dayplans', async (req, res) => {
  try {
    const {date, blocks, freeSlots} = req.body;
    //簡単なバリデーション
    if(!date || !Array.isArray(blocks) || !Array.isArray(freeSlots)){
      return res.status(400).json({error: 'Invalid input data'});
    }
    const dayplan = new Dayplan({
      date,
      blocks,
      freeSlots,
    })

    const saved = await dayplan.save()
    res.status(201).json(saved) 
  } catch (error) {
    console.error('Error saving Dayplam:', error)
    res.status(500).json({error: 'Internal server error'});
  }
})

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});