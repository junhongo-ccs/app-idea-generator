'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [users, setUsers] = useState('100')
  const [period, setPeriod] = useState('3')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSubmit = async () => {
    if (!idea.trim()) {
      alert('アプリアイデアを入力してください')
      return
    }

    setIsLoading(true)
    setResult('')
    
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
      
      if (data.success) {
        setResult(data.response)
      } else {
        setResult('エラーが発生しました: ' + data.error)
      }
    } catch (error) {
      console.error('エラー:', error)
      setResult('通信エラーが発生しました')
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
                <option value="1000">1000人</option>
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
                <option value="3">3ヶ月</option>
                <option value="6">6ヶ月</option>
                <option value="12">1年</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 text-lg font-medium shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? '生成中...' : '技術構成を提案してもらう'}
          </button>
        </div>

        {/* 結果表示エリア */}
        {(isLoading || result) && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">AI技術構成提案</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-white text-lg">AIが技術構成を考案中...</span>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
                <div className="prose max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>,
                      p: ({children}) => <p className="text-gray-100 mb-3 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside text-gray-100 mb-3 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside text-gray-100 mb-3 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-gray-100">{children}</li>,
                      strong: ({children}) => <strong className="text-white font-bold">{children}</strong>,
                      code: ({children}) => <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm">{children}</code>,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}