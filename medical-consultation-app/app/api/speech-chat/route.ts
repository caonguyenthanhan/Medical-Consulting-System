import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio_file') as File
    const context = formData.get('context') as string || 'health consultation'
    const conversationHistory = formData.get('conversation_history') as string
    const useOptimized = formData.get('use_optimized') === 'true'

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Check if optimized endpoint should be used
    if (useOptimized) {
      console.log('Using optimized speech-chat endpoint...')
      
      // Use the new optimized backend endpoint
      const optimizedFormData = new FormData()
      optimizedFormData.append('audio_file', audioFile)

      const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
      const optimizedResponse = await fetch(`${BACKEND_URL}/v1/speech-chat-optimized`, {
        method: 'POST',
        body: optimizedFormData,
      })

      if (!optimizedResponse.ok) {
        throw new Error('Optimized speech-chat failed')
      }

      const optimizedData = await optimizedResponse.json()
      
      if (optimizedData.success) {
        // Modify the audio_url to use the backend URL (similar to text-to-speech route)
        let audioUrl = optimizedData.audio_url
        if (audioUrl && audioUrl.startsWith('/v1/audio/')) {
          audioUrl = `${BACKEND_URL}${audioUrl}`
        }
        
        return NextResponse.json({
          success: true,
          user_text: optimizedData.user_text,
          ai_response: optimizedData.ai_response,
          audio_url: audioUrl,
          optimized: true,
          chunking_used: optimizedData.chunking_used
        })
      } else {
        return NextResponse.json({
          success: false,
          error: optimizedData.error || 'Optimized processing failed',
          step: 'optimized-speech-chat'
        })
      }
    }

    // Step 1: Speech-to-Text
    const speechToTextFormData = new FormData()
    speechToTextFormData.append('audio_file', audioFile)

    const speechResponse = await fetch(`${request.nextUrl.origin}/api/speech-to-text`, {
      method: 'POST',
      body: speechToTextFormData,
    })

    if (!speechResponse.ok) {
      throw new Error('Speech-to-text failed')
    }

    const speechData = await speechResponse.json()
    
    if (!speechData.success || !speechData.text) {
      return NextResponse.json({
        success: false,
        error: speechData.error || 'Could not understand audio',
        step: 'speech-to-text'
      })
    }

    const userText = speechData.text

    // Step 2: AI Chat
    let parsedHistory = []
    try {
      if (conversationHistory) {
        parsedHistory = JSON.parse(conversationHistory)
      }
    } catch (e) {
      console.warn('Failed to parse conversation history:', e)
    }

    const chatResponse = await fetch(`${request.nextUrl.origin}/api/llm-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
        context: context,
        conversationHistory: parsedHistory
      }),
    })

    if (!chatResponse.ok) {
      throw new Error('AI chat failed')
    }

    const chatData = await chatResponse.json()
    const aiResponse = chatData.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.'

    // Step 3: Text-to-Speech
    const ttsResponse = await fetch(`${request.nextUrl.origin}/api/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: aiResponse,
        lang: 'vi'
      }),
    })

    if (!ttsResponse.ok) {
      throw new Error('Text-to-speech failed')
    }

    const ttsData = await ttsResponse.json()

    // Return complete response
    return NextResponse.json({
      success: true,
      user_text: userText,
      ai_response: aiResponse,
      audio_url: ttsData.success ? ttsData.audio_url : null,
      context: chatData.context,
      metadata: {
        speech_to_text_success: speechData.success,
        ai_chat_success: true,
        text_to_speech_success: ttsData.success,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in speech-chat API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}