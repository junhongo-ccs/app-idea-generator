import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { idea, users, period } = await request.json()
    
    console.log('受信したデータ:', { idea, users, period })
    
    return NextResponse.json({ 
      message: 'テスト成功！',
      received: { idea, users, period }
    })
  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}