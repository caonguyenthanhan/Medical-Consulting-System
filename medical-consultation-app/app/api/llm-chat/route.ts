import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini-service'

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
    
    console.log(`[Gemini API] Context: ${determinedContext}`)
    console.log(`[Gemini API] Question: ${userMessage}`)
    
    // Call Gemini service
     const response = await geminiService.generateResponse(
       userMessage,
       determinedContext
     )
    
    console.log(`[Gemini API] Response generated successfully`)
    
    return NextResponse.json({
      response: response,
      context: determinedContext,
      model_info: {
        model_name: 'gemini-1.5-flash',
        provider: 'Google AI'
      },
      metadata: {
        context: determinedContext,
        prompt_length: userMessage.length,
        response_length: response.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error in Gemini chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
