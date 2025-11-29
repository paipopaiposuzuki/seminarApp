import { useState } from 'react'
import './App.css'

function App() {
  const[date, setDate] = useState('2024-06-01'); //日付をstateで管理
  const [saveStatus, setSaveStatus] = useState(''); //保存ステータスを管理
  //予定ブロックを追加する
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      title: "授業",
      start: "10:00",
      end: "11:00",
      location: "campus"
    }
  ])

  //隙間時間をstateに追加する
  const [freeSlots,setFreeSlots] = useState([])

  //新しいブロックの追加を行う
  const addBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: "新しい予定",
        start: "12:00",
        end: "13:00",
        location: "other"
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

  //

  //時間を計算するために分換算する関数を作る
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number); //:で時間と分を分割し、map関数で配列内の各要素を数値に変換
    return h * 60 + m;
  }
  //分換算を時間に戻す関数を作る
  const minutesToTime = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, '0'); //padStartで2桁に揃える
    const m = String(minutes % 60).padStart(2, '0');
    return `${h}:${m}`;
  }
  //隙間時間を計算する関数を作る
  const calcFreeSlots = () => {
    if (blocks.length === 0) return [];

    //予定を開始時間でソート
    const sorted = [...blocks].sort(
      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
    )
    const freeSlots = []

    //とりあえず一日の始まりを08:00に設定
    let currentTime = timeToMinutes("08:00");
    let currentLocation = sorted[0].location; //?最初の予定の場所を現在の場所とする

    for(const block of sorted){
      const blockStart = timeToMinutes(block.start);
      const blockEnd = timeToMinutes(block.end);

      //今の時間と、次の予定の間に隙間があれば追加
      if(blockStart > currentTime){
        freeSlots.push({
          start: minutesToTime(currentTime),
          end: minutesToTime(blockStart),
          baseLocation: currentLocation,
        }
        )
      }

      //次の基準時間をこの予定の終了に更新
      currentTime = blockEnd;
      currentLocation = block.location;
    }

    //最後の予定の後も隙間が欲しければ例えば22:00までを見る
    const END_OF_DAY = timeToMinutes("22:00")
    if(currentTime < END_OF_DAY){
      freeSlots.push({
        start: minutesToTime(currentTime),
        end: minutesToTime(END_OF_DAY),
        baseLocation: currentLocation,
      })
    }
    return freeSlots;
  }

  //隙間時間を計算してstateにセットする
  const handleCalcFreeSlots = () => {
    const slots = calcFreeSlots();
    setFreeSlots(slots)
  }

  //mongoDBに保存する関数を作る
  const handleSaveDayplan = async () => {
    setSaveStatus('保存中...'); //？保存中のステータスをセット
    const slotsToSave = freeSlots.length > 0 ? freeSlots : calcFreeSlots(); //隙間時間を再計算して保存用に取得

    try{
      const res = await fetch('http://localhost:3000/dayplans', {
        method: 'POST',
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          date,
          blocks: blocks.map(({id, ...rest})  => rest), //idを除いたオブジェクトを送る
          freeSlots: slotsToSave,
        }),
    })
    if(!res.ok){
      throw new Error('保存に失敗しました')
    }
    const data = await res.json()
    console.log('保存成功', data)
    setSaveStatus('保存成功!')
  } catch(error){
    console.error('保存エラー',error)
    setSaveStatus('保存に失敗しました')
  }
}
  
  
  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <label>日付：
          <input type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} 
          />
        </label>
      </div>
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
                <option value="campus">キャンパス周辺</option>
                <option value="station">駅周辺</option>
                <option value="home">自宅周辺</option>
                <option value="other">そのほか</option>
              </select>
            </label>
          </div>
        </div>
      ))}
      <button onClick={addBlock}>予定を追加</button>{/*onClickで予定を追加 */} 
      <hr style={{ margin: '16px 0'}} />
      <button onClick={handleCalcFreeSlots}>スキマ時間を計算</button>
      <button onClick={handleSaveDayplan} style={{ marginLeft: '8px' }}>予定を保存</button>
      {saveStatus && <p>{saveStatus}</p>}


    <h2>スキマ時間</h2>
    {freeSlots.length === 0 && <p>スキマ時間はありません</p>}
    <ul>
      {freeSlots.map((slot, index) => (
        <li key={index}>
          {slot.start} ~ {slot.end}  (場所： {slot.baseLocation})
        </li>
      ))}
    </ul> 
    </div>
  )
}


export default App
