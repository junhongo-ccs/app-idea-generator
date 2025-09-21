
'use client'

import { useState } from 'react'

export default function Home() {

    const [idea, setIdea] = useState('')
  const [users, setUsers] = useState('100')
  const [period, setPeriod] = useState('1')
  const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: idea,
        users: users,
        period: period,
      }),
    })
    
    const data = await response.json()
    console.log('AI応答:', data)
  } catch (error) {
    console.error('エラー:', error)
  }
  
  setIsLoading(false)
}

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          アプリアイデア → 技術構成提案ツール
        </h1>
        <p className="text-center text-gray-300 mb-8 text-lg">
          あなたのアプリアイデアを入力すると、AIが本格的な技術構成を提案します
        </p>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">アプリアイデアを入力してください</h2>
        

<textarea 
  value={idea}
  onChange={(e) => setIdea(e.target.value)}
  placeholder="例：社内の会議室予約システム"
  className="w-full h-40 p-4 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md mb-6 text-lg"
/>
          

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-lg font-medium mb-3 text-white">想定ユーザー数</label>
         
            <select 
  value={users}
  onChange={(e) => setUsers(e.target.value)}
  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md text-lg"
>
             
                <option value="100">100人</option>
                <option value="10000">1万人</option>
                <option value="1000000">100万人</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 text-white">開発期間</label>
            
             <select 
  value={period}
  onChange={(e) => setPeriod(e.target.value)}
  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md text-lg"
>
            
                <option value="1">1ヶ月</option>
                <option value="6">6ヶ月</option>
                <option value="12">1年</option>
              </select>
            </div>
          </div>
          
<button 
  onClick={handleSubmit}
  className="bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 text-lg font-medium shadow-lg"
>
  技術構成を提案してもらう
</button>
        </div>
      </div>
    </div>
  )
}