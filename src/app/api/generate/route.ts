import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// OpenAIクライアントの初期化をtry-catch内に移動
export async function POST(request: NextRequest) {
  try {
    const { idea, users, period } = await request.json()
    
    // APIキーの存在確認
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    const prompt = `
あなたは経験豊富なシステムエンジニアです。以下のアプリアイデアについて、詳細な技術構成を提案してください。

アプリアイデア: ${idea}
想定ユーザー数: ${users}人
開発期間: ${period}ヶ月

以下の形式で、具体的で実装可能な提案をマークダウン形式で出力してください：

# システム概要
（アプリの全体像を3行程度で説明）

## 技術スタック
### フロントエンド
- 
### バックエンド
- 
### データベース
- 
### インフラ・デプロイ
- 

## 主要機能一覧
1. 
2. 
3. 

## データベース設計案
### 主要テーブル
**usersテーブル**
- 

**（その他必要なテーブル）**
- 

## 画面構成案
1. **画面名**: 説明
2. **画面名**: 説明

## 開発工数見積
### フェーズ別工数（${period}ヶ月）
- **要件定義・設計**: X週間
- **開発**: X週間
- **テスト**: X週間
- **デプロイ・運用準備**: X週間

## リスク・注意点
### 技術的リスク
- 

### 運用面の考慮事項
- 

${period}ヶ月という開発期間を現実的に考慮し、ユーザー数（${users}人）に応じて適切な技術選定を行ってください。期間が短い場合はMVP（最小機能）を、長い場合は本格的なシステムを提案してください。
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'レスポンスを取得できませんでした'

    return NextResponse.json({ 
      success: true,
      response: aiResponse
    })
  } catch (error) {
    console.error('OpenAI API エラー:', error)
    return NextResponse.json(
      { error: 'AI応答の生成に失敗しました' },
      { status: 500 }
    )
  }
}