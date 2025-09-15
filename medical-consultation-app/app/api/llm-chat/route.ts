import { NextRequest, NextResponse } from 'next/server'
import { LLM_CONFIG, createPrompt, parseModelResponse } from '@/lib/llm-config'

// TODO: Implement actual Python LLM service integration
// This is a placeholder for the real model inference
async function callPythonLLMService(prompt: string): Promise<string> {
  // In a real implementation, this would:
  // 1. Call a Python service running the fine-tuned Llama model
  // 2. Use the adapter from LLM_CONFIG.adapter_dir
  // 3. Return the actual model response
  
  // For now, simulate model response based on the notebook logic
  const simulatedResponse = `### Question:
${prompt.split('### Question:')[1]?.split('### Answer:')[0]?.trim() || prompt}

### Answer:
Đây là câu trả lời được tạo bởi mô hình Llama đã được fine-tune trên dữ liệu y tế tiếng Việt. Mô hình đã được huấn luyện để hiểu và trả lời các câu hỏi về sức khỏe một cách chính xác và hữu ích.

Dựa trên câu hỏi của bạn, tôi khuyên bạn nên:
1. Tham khảo ý kiến bác sĩ chuyên khoa
2. Theo dõi các triệu chứng và ghi chép lại
3. Tuân thủ các hướng dẫn điều trị nếu có

Lưu ý quan trọng: Thông tin này chỉ mang tính chất tham khảo và không thể thay thế lời khuyên chuyên môn của bác sĩ. Vui lòng tham khảo ý kiến chuyên gia y tế để có chẩn đoán và điều trị chính xác.`
  
  return simulatedResponse
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, question } = await request.json()
    
    // Log configuration for debugging
    console.log(`[LLM API] Model: ${LLM_CONFIG.model_name}, Adapter: ${LLM_CONFIG.adapter_dir}`)
    
    // Create formatted prompt using the same format as the notebook
    const formattedPrompt = createPrompt(question || prompt)
    console.log(`[LLM API] Question: ${question || prompt}`)
    console.log(`[LLM API] Formatted prompt length: ${formattedPrompt.length} chars`)
    
    // Call the LLM service (currently simulated)
    const rawResponse = await callPythonLLMService(formattedPrompt)
    console.log(`[LLM API] Raw response length: ${rawResponse.length} chars`)
    
    // Parse the response using the same logic as the notebook
    const parsedResponse = parseModelResponse(rawResponse)
    console.log(`[LLM API] Parsed response: ${parsedResponse.substring(0, 200)}...`)
    console.log(`[LLM API] Response sent successfully`)
    
    return NextResponse.json({
      response: parsedResponse,
      model_info: {
        model_name: LLM_CONFIG.model_name,
        adapter_dir: LLM_CONFIG.adapter_dir,
        max_tokens: LLM_CONFIG.max_new_tokens,
        generation_params: LLM_CONFIG.generation_params
      },
      metadata: {
        context: context,
        prompt_length: formattedPrompt.length,
        response_length: parsedResponse.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error in LLM chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
