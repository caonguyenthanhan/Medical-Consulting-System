# Tích hợp Gemini API cho Hệ thống Tư vấn Y tế

## Tổng quan

Dự án đã được tích hợp với Google Gemini API để cung cấp khả năng AI mạnh mẽ cho hệ thống tư vấn y tế. Gemini API được sử dụng thay thế cho mô hình Llama local để đảm bảo hiệu suất và độ tin cậy cao.

## Cấu hình API Key

### 1. Lấy API Key từ Google AI Studio

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Sao chép API key

### 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root của dự án:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_NAME="AI Medical Consultation System"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Configuration
NODE_ENV=development
```

## Kiến trúc Tích hợp

### 1. Gemini Service (`lib/gemini-service.ts`)

Service chính xử lý tương tác với Gemini API:

- **Prompt Templates**: Các template được tối ưu cho từng ngữ cảnh y tế
- **Safety Settings**: Cấu hình an toàn cho nội dung y tế
- **Context Detection**: Tự động nhận diện ngữ cảnh từ câu hỏi người dùng

### 2. API Route (`app/api/llm-chat/route.ts`)

Endpoint xử lý requests từ frontend:

- **Context Determination**: Phân loại câu hỏi theo ngữ cảnh
- **Error Handling**: Xử lý lỗi và fallback responses
- **Response Formatting**: Định dạng phản hồi chuẩn

### 3. Frontend Integration (`components/ai-chat-box.tsx`)

Component chat được cập nhật để:

- Gửi conversation history cho context tốt hơn
- Xử lý responses từ Gemini API
- Hiển thị loading states và error handling

## Prompt Templates

### 1. Health Consultation (Tư vấn Sức khỏe)

```
Bạn là một trợ lý AI chuyên về y tế, được huấn luyện để hỗ trợ tư vấn sức khỏe bằng tiếng Việt.

NGUYÊN TẮC QUAN TRỌNG:
- Luôn nhấn mạnh rằng thông tin chỉ mang tính chất tham khảo
- Khuyến khích người dùng tham khảo ý kiến bác sĩ chuyên khoa
- Không đưa ra chẩn đoán chính thức
- Cung cấp thông tin dựa trên kiến thức y khoa đáng tin cậy
```

### 2. Health Lookup (Tra cứu Y khoa)

```
Bạn là một cơ sở dữ liệu y khoa thông minh, chuyên cung cấp thông tin chính xác về bệnh lý, thuốc men, triệu chứng.

NHIỆM VỤ:
- Cung cấp thông tin y khoa chính xác và đầy đủ
- Giải thích các thuật ngữ y khoa phức tạp
- Liệt kê các thông tin liên quan
```

### 3. Psychological Support (Hỗ trợ Tâm lý)

```
Bạn là một chuyên gia tâm lý học lâm sàng, chuyên hỗ trợ sức khỏe tâm thần bằng tiếng Việt.

NGUYÊN TẮC HỖ TRỢ:
- Thể hiện sự đồng cảm và hiểu biết
- Cung cấp thông tin dựa trên nghiên cứu khoa học
- Đề xuất các kỹ thuật tự chăm sóc an toàn
```

## Context Detection

Hệ thống tự động phát hiện ngữ cảnh dựa trên từ khóa:

### Psychological Support
- Keywords: `tâm lý`, `stress`, `lo âu`, `trầm cảm`, `tâm trạng`, `cảm xúc`

### Health Lookup  
- Keywords: `tra cứu`, `thông tin`, `bệnh`, `thuốc`, `triệu chứng`, `chẩn đoán`

### Health Consultation (Default)
- Tất cả các câu hỏi khác

## Safety & Security

### 1. Content Safety

```javascript
safetySettings: [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH", 
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
]
```

### 2. Generation Configuration

```javascript
generationConfig: {
  temperature: 0.3,    // Giảm tính ngẫu nhiên cho độ chính xác cao
  topK: 40,
  topP: 0.8,
  maxOutputTokens: 1024
}
```

### 3. Medical Disclaimer

Tất cả responses đều được thêm disclaimer:

```
⚠️ **Lưu ý quan trọng:** Thông tin này chỉ mang tính chất tham khảo và không thể thay thế lời khuyên chuyên môn của bác sĩ. Vui lòng tham khảo ý kiến chuyên gia y tế để có chẩn đoán và điều trị chính xác.
```

## Testing & Debugging

### 1. Test Connection

```javascript
// Test Gemini API connection
const isConnected = await geminiService.testConnection()
console.log('Gemini API Status:', isConnected ? 'Connected' : 'Failed')
```

### 2. Debug Logs

API route logs thông tin chi tiết:

```
[Gemini API] Context: health consultation
[Gemini API] Question: Tôi bị đau đầu
[Gemini API] Response generated successfully
```

### 3. Error Handling

- Network errors: Retry mechanism
- API errors: Fallback responses
- Rate limiting: Graceful degradation

## Performance Optimization

### 1. Response Caching

Có thể implement caching cho các câu hỏi phổ biến:

```javascript
// Future enhancement: Redis caching
const cacheKey = `gemini:${context}:${questionHash}`
```

### 2. Request Optimization

- Giới hạn độ dài prompt
- Batch processing cho multiple requests
- Connection pooling

## Monitoring & Analytics

### 1. Usage Metrics

Track các metrics quan trọng:

- Request count per context
- Response time
- Error rates
- User satisfaction

### 2. Cost Management

Monitor API usage để kiểm soát chi phí:

- Token usage per request
- Daily/monthly limits
- Cost per conversation

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Kiểm tra API key trong `.env.local`
   - Verify API key trên Google AI Studio

2. **Rate Limiting**
   - Implement exponential backoff
   - Add request queuing

3. **Response Quality**
   - Fine-tune prompt templates
   - Adjust generation parameters

### Debug Commands

```bash
# Test API connection
curl -X POST http://localhost:3000/api/llm-chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Xin chào", "context": "general"}'
```

## Future Enhancements

1. **Multi-language Support**: Extend prompts for English/other languages
2. **Specialized Models**: Use different Gemini models for different contexts
3. **Fine-tuning**: Custom fine-tuning on Vietnamese medical data
4. **Voice Integration**: Add speech-to-text and text-to-speech
5. **Image Analysis**: Integrate Gemini Vision for medical image analysis

## API Reference

### Request Format

```json
{
  "question": "Câu hỏi của người dùng",
  "context": "health consultation | health lookup | psychological support",
  "conversationHistory": [
    {
      "role": "user | assistant",
      "content": "Nội dung tin nhắn"
    }
  ]
}
```

### Response Format

```json
{
  "response": "Phản hồi từ AI",
  "context": "Ngữ cảnh được xác định",
  "model_info": {
    "model_name": "gemini-1.5-flash",
    "provider": "Google AI"
  },
  "metadata": {
    "context": "health consultation",
    "prompt_length": 150,
    "response_length": 500,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```