import { NextRequest, NextResponse } from 'next/server'

// Determine context based on the conversation or user input
function determineContext(userMessage: string, conversationHistory?: any[]): string {
  const message = userMessage.toLowerCase()
  
  // Keywords for different contexts
  if (message.includes('tâm lý') || message.includes('stress') || message.includes('lo âu') || 
      message.includes('trầm cảm') || message.includes('tâm trạng') || message.includes('cảm xúc')) {
    return 'psychological support'
  }
  
  if (message.includes('tra cứu') || message.includes('thông tin') || message.includes('bệnh') ||
      message.includes('thuốc') || message.includes('triệu chứng') || message.includes('chẩn đoán')) {
    return 'health lookup'
  }
  
  // Default to health consultation
  return 'health consultation'
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, question, message, conversationHistory } = await request.json()
    
    const userMessage = message || question || prompt
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Determine context based on user message
    const determinedContext = context || determineContext(userMessage, conversationHistory)
    
    const fastApiUrl = process.env.INTERNAL_LLM_URL || 'http://127.0.0.1:8000/v1/chat/completions'
    const systemPrompt = `You are a medical consultation assistant. Provide helpful, safe, and culturally appropriate answers in Vietnamese. Context: ${determinedContext}`
    const body = {
      model: 'local-llama',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(Array.isArray(conversationHistory) ? conversationHistory : []).map((m: any) => ({
          role: m.role || 'user',
          content: m.content || ''
        })),
        { role: 'user', content: userMessage }
      ],
      max_tokens: 1024,
      temperature: 0.7
    }

    const resp = await fetch(fastApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error('LLM server error:', text)
      return NextResponse.json(
        { error: 'LLM server error', details: text },
        { status: 502 }
      )
    }

    let data
    try {
      const responseText = await resp.text()
      console.log('Raw response:', responseText)
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server')
      }
      
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON response from server', details: parseError instanceof Error ? parseError.message : 'Unknown parsing error' },
        { status: 502 }
      )
    }

    const content = data?.choices?.[0]?.message?.content || data?.response || ''

    if (!content) {
      console.error('No content in response:', data)
      return NextResponse.json(
        { error: 'No content in response', details: JSON.stringify(data) },
        { status: 502 }
      )
    }

    return NextResponse.json({
      response: content,
      context: determinedContext,
      model_info: {
        model_name: 'local-llama-compatible',
        provider: 'Internal FastAPI'
      },
      metadata: {
        context: determinedContext,
        prompt_length: userMessage.length,
        response_length: content.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error in internal chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
