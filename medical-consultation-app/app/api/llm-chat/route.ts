import { type NextRequest, NextResponse } from "next/server"
import { LLM_CONFIG, parseModelResponse } from "@/lib/llm-config"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, question } = await request.json()

    // In production, this would interface with your actual Python model
    // You can replace this with actual model calls using your adapter_dir and model_name

    console.log(`[v0] LLM Config - Model: ${LLM_CONFIG.model_name}, Adapter: ${LLM_CONFIG.adapter_dir}`)
    console.log(`[v0] Processing question with context: ${context}`)
    console.log(`[v0] Formatted prompt: ${prompt}`)

    // Simulate model processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Mock response based on context and question
    let mockResponse = ""

    if (context === "psychological support") {
      mockResponse = `### Answer:
Cảm ơn bạn đã chia sẻ với tôi. Tôi hiểu rằng "${question}" là một vấn đề quan trọng đối với bạn. 

Dựa trên những gì bạn mô tả, tôi khuyên bạn nên:
- Dành thời gian để thư giãn và chăm sóc bản thân
- Thực hành các kỹ thuật hít thở sâu hoặc thiền định
- Tìm kiếm sự hỗ trợ từ gia đình và bạn bè

Tuy nhiên, nếu tình trạng này kéo dài hoặc ảnh hưởng nghiêm trọng đến cuộc sống hàng ngày của bạn, tôi khuyên bạn nên tham khảo ý kiến của chuyên gia tâm lý để được hỗ trợ tốt nhất.

Bạn có muốn chia sẻ thêm về cảm xúc hiện tại của mình không?`
    } else if (context === "health lookup") {
      mockResponse = `### Answer:
Về câu hỏi "${question}" của bạn, đây là thông tin tôi có thể cung cấp:

Dựa trên các nguồn y khoa đáng tin cậy, tình trạng này thường có các đặc điểm sau:
- Nguyên nhân phổ biến và yếu tố nguy cơ
- Triệu chứng thường gặp cần lưu ý
- Các biện pháp chăm sóc và phòng ngừa cơ bản

**Lưu ý quan trọng:** Thông tin này chỉ mang tính chất tham khảo. Để có chẩn đoán chính xác và phương pháp điều trị phù hợp, bạn cần tham khảo ý kiến bác sĩ chuyên khoa.

Bạn có muốn tìm hiểu thêm về khía cạnh nào cụ thể không?`
    } else {
      mockResponse = `### Answer:
Cảm ơn bạn đã hỏi về "${question}". Đây là một câu hỏi quan trọng về sức khỏe.

Dựa trên kiến thức y khoa hiện tại, tôi có thể chia sẻ một số thông tin hữu ích. Tuy nhiên, tôi khuyên bạn nên tham khảo ý kiến bác sĩ chuyên khoa để có lời khuyên chính xác và phù hợp nhất với tình trạng cụ thể của bạn.

Trong thời gian chờ đợi, bạn có thể thực hiện các biện pháp chăm sóc cơ bản như nghỉ ngơi đầy đủ, uống nhiều nước và duy trì lối sống lành mạnh.

Bạn có muốn tôi giải thích thêm về khía cạnh nào không?`
    }

    // Parse the response using the same logic as Python file
    const parsedResponse = parseModelResponse(mockResponse)

    return NextResponse.json({
      generated_text: mockResponse,
      parsed_response: parsedResponse,
      model_config: {
        model_name: LLM_CONFIG.model_name,
        adapter_dir: LLM_CONFIG.adapter_dir,
      },
    })
  } catch (error) {
    console.error("[v0] LLM API Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
