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
想定ユーザー数（${users}人）とアプリの性質に応じて、最適な技術選定を行ってください。

### フロントエンド
（Web/モバイル/デスクトップアプリの特性、ユーザー数、開発期間を考慮した技術選定と選定理由）

### バックエンド  
（スケーラビリティ、開発効率、運用コストを考慮した技術選定と選定理由）

### データベース
（データ特性、アクセスパターン、規模に応じた選定と選定理由）

### インフラ・デプロイ
（ユーザー数、可用性要件、コスト効率を考慮した選定と選定理由）

各技術選定について、なぜその技術を選んだのか具体的な理由も説明してください。
スマホアプリならFlutter/React Native/Swift/Kotlin、Webアプリでも React/Vue.js/Angular/Next.js など、
適切な選択肢から最適解を提案してください。


## 主要機能一覧
1. 
2. 
3. 
4.
5.
6.

## データベース設計案
### 主要テーブル
**usersテーブル**
- 

**（その他必要なテーブル）**
- 

## 画面構成案
このアプリに必要な画面を具体的に設計してください。

各画面について：
- 画面の目的と主要機能
- 表示する情報・入力項目
- 他画面との連携・遷移
- ユーザー体験の観点での工夫

を詳しく説明してください。${users}人規模での利用を想定し、実際の利用シーンに沿った実用的な画面設計を提案してください。

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