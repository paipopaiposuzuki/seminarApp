import { useState } from 'react'
import './App.css'

function App() {
  //予定ブロックを追加する
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      title: "授業",
      start: "10:00",
      end: "11:00",
      location: "教室"
    }
  ])
  //新しいブロックの追加を行う
  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "新しい予定",
        start: "12:00",
        end: "13:00",
        location: "場所"
      }
    ])
  }

  //フォーム入力の更新関数
  const updateBlock = (id, field, value) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    )
  }

  //時間を計算するために分換算する関数を作る
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number); //:で時間と分を分割し、map関数で配列内の各要素を数値に変換
    return h * 60 + m;
  }
  //分換算を時間に戻す関数を作る
  const minutesToTime = (minutes) =>{
    const h = String(Math.floor(minutes / 60)).padStart(2, '0'); //padStartで2桁に揃える
    const m = String(minutes % 60).padStart(2, '0');
    return `${h}:${m}`;
}
  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>今日の予定を入力</h1>

      {blocks.map((block) => (
        <div key={block.id}
          //スタイル設定
          style={{
            border: '1px solid #ccc',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px'
          }}
        >{/*タイトル入力欄 */}
          <div>
            <label>
              タイトル:
              <input
                type="text"
                value={block.title}
                onChange={(e) => updateBlock(block.id, "title", e.target.value)}
              />
            </label>
          </div>
          {/*開始時間入力欄 */}
          <div>
            <label>
              開始時間:
              <input
                type="time"
                value={block.start}
                onChange={(e) => updateBlock(block.id, "start", e.target.value)}
              />
            </label>
          </div>
          {/*終了時間入力欄 */}
          <div>
            <label>
              終了時間:
              <input
                type="time"
                value={block.end}
                onChange={(e) => updateBlock(block.id, "end", e.target.value)}
              />
            </label>
          </div>
          {/*場所入力欄 */}
          <div>
            <label>
              場所:
              <select
                value={block.location}
                onChange={(e) => updateBlock(block.id, "location", e.target.value)}
              >
                <option value="campas">キャンパス周辺</option>
                <option value="station">駅周辺</option>
                <option value="home">自宅周辺</option>
                <option value="other">そのほか</option>
              </select>
            </label>
          </div>
        </div>
      ))}
      <button onClick={addBlock}>予定を追加</button>{/*onClickで予定を追加 */}
      </div>
  )
}


      export default App
