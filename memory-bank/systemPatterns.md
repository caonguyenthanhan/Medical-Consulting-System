# System Patterns - Hệ thống Tư vấn Y tế AI

## Kiến trúc tổng thể

### Frontend Architecture
```
Next.js App Router
├── app/
│   ├── page.tsx (Landing page)
│   ├── layout.tsx (Root layout)
│   ├── globals.css (Global styles)
│   └── api/
│       └── llm-chat/route.ts (API endpoint)
│       └── tam-su-chat/route.ts (Proxy friend chat, GPU/CPU fallback)
├── components/
│   ├── chat-interface.tsx
│   ├── health-lookup.tsx
│   ├── psychological-screening.tsx
│   ├── ai-chat-box.tsx
│   └── ui/ (Shadcn/ui components)
├── lib/
│   ├── llm-config.ts (LLM configuration)
│   └── utils.ts (Utilities)
└── hooks/
    ├── use-mobile.ts
    └── use-toast.ts
```

#### Speech Chat + Camera (mới)
```
app/speech-chat/page.tsx
├─ Recorder: MediaRecorder (webm/opus) → STT
├─ Camera: getUserMedia(video) → capture → base64
├─ Functions:
│  ├─ handleOptimizedSpeechChat(audioBlob)
│  ├─ handleSpeechToText(audioBlob)
│  ├─ handleSpeechToTextWithImage(audioBlob)
│  ├─ sendImageWithText(text, imageBase64) → POST /v1/vision-chat
│  └─ sendToAI(userInput, imageBase64?) → text hoặc vision
└─ UI: nút ghi âm, nút camera, upload, preview ảnh, auto TTS
```

### Backend Architecture
```
Python LLM Service
├── Fine-tuned Llama Model
├── Adapter Directory (LoRA weights)
├── Model Inference Engine
└── API Interface
```

#### Endpoints chính (mới)
```
POST /v1/speech-chat-optimized   # STT chunking + AI response + streaming TTS
POST /v1/vision-chat             # Text + Image để VLM phân tích
GET  /v1/audio/<file>.mp3        # Phát âm thanh TTS (streaming hỗ trợ 206)
POST /v1/friend-chat/completions # Chat bạn bè (tam-su) trên GPU, nhận X-Mode và trả metadata mode
```

## Quyết định kỹ thuật chính

### Frontend Stack
- **Next.js 14**: App Router cho performance và SEO tốt
- **TypeScript**: Type safety và developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Component library với Radix UI
- **Lucide React**: Icon library

### AI/ML Stack
- **Llama 2/3**: Base model cho khả năng hiểu ngôn ngữ tự nhiên
- **LoRA Fine-tuning**: Efficient fine-tuning cho dữ liệu y tế Việt
- **Hugging Face Transformers**: Model loading và inference
- **PyTorch**: Deep learning framework
- **llama.cpp/gguf**: Runtime nạp model `.gguf` cho text/vision
  - Text: `Llama-3.2-1B-Instruct-Q6_K_L.gguf`
  - Vision: `llava-v1.5-7b-Q6_K.gguf` + `llava-v1.5-7b-mmproj-model-f16.gguf`
 - **GPU Modes**: `flash`, `pro`, `tam-su` đồng bộ qua header `X-Mode` và phản hồi kèm `mode`.
 - **Notebook Cells Integration**: Thư mục `colab server/server_ai_mcs/` chứa các cell riêng; `Cell 6 server .py` là cell server có đầy đủ `POST /v1/chat/completions` và `POST /v1/friend-chat/completions`.

### Data Sources
- **ViHealthQA**: Dataset y tế tiếng Việt
- **Mental Health Dataset**: Dữ liệu sàng lọc tâm lý
- **Synthetic Data**: Generated bằng Gemini cho data augmentation

## Mẫu thiết kế

### Component Patterns

#### 1. Feature-based Components
```typescript
// Mỗi tính năng chính có component riêng
- ChatInterface: Tư vấn AI
- HealthLookup: Tra cứu y khoa  
- PsychologicalScreening: Sàng lọc tâm lý
```

#### 2. Shared AI Chat Box
```typescript
// AiChatBox component tái sử dụng cho nhiều context
interface AiChatBoxProps {
  placeholder: string
  initialMessage: string
  context: 'health lookup' | 'psychological support' | 'general'
}
```

#### 3. State Management Pattern
```typescript
// Local state với useState cho UI state
// Context API cho shared state nếu cần
const [activeTab, setActiveTab] = useState<ActiveTab>('home')
const [showChat, setShowChat] = useState(false)
```

### API Patterns

#### 1. LLM Chat API
```typescript
// POST /api/llm-chat
interface ChatRequest {
  prompt: string
  context: string
  question: string
}

interface ChatResponse {
  response: string
  confidence?: number
  sources?: string[]
}
```

#### 2. Error Handling
```typescript
// Consistent error handling across API routes
try {
  // API logic
} catch (error) {
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

#### 3. Vision Chat API
```json
// POST /v1/vision-chat
{
  "text": "thuốc này dùng để trị gì?",
  "image_base64": "<JPEG/PNG base64 without data URL prefix>",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

Phản hồi:
```json
{ "success": true, "response": "Giải thích về thuốc..." }
```

### Data Flow Patterns

#### 1. User Interaction Flow
```
User Input → Component State → API Call → LLM/VLM Processing → Response + Optional TTS
```

#### 2. Assessment Flow
```
Question Display → User Answer → Score Calculation → Result Interpretation → Recommendations
```

## Mối quan hệ thành phần

### Component Hierarchy
```
RootLayout
└── HomePage
    ├── FeatureCards (Navigation)
    ├── ChatInterface
    │   └── AiChatBox
    ├── HealthLookup
    │   ├── SearchInterface
    │   ├── CategoryFilter
    │   ├── ResultsList
    │   └── AiChatBox
    └── PsychologicalScreening
        ├── AssessmentSelector
        ├── QuestionInterface
        ├── ProgressTracker
        ├── ResultsDisplay
        └── AiChatBox
```

### Data Dependencies
```
LLM Config → API Routes → Components → UI State
Assessment Data → Scoring Logic → Results → Recommendations
Search Data → Filter Logic → Display → Chat Context
```

## Security Patterns

### Data Protection
- Client-side validation cho user inputs
- Server-side sanitization cho API requests
- No persistent storage của sensitive data
- HTTPS enforcement

### AI Safety
- Input validation và filtering
- Output moderation
- Disclaimer requirements
- Rate limiting cho API calls

## Performance Patterns

### Frontend Optimization
- Component lazy loading
- Image optimization với Next.js
- CSS-in-JS với Tailwind
- Bundle splitting tự động

### Backend Optimization
- Model caching
- Response streaming nếu cần
- Async processing
- Connection pooling
- TTS chunk streaming để giảm thời gian chờ

## Deployment Patterns

### Development
```bash
npm run dev  # Next.js development server
python app.py  # LLM service locally
```

### Production
```bash
npm run build  # Static generation
npm start     # Production server
# LLM service deployment (Docker/Cloud)
```

## Monitoring & Logging

### Frontend Monitoring
- Vercel Analytics integration
- Error boundary components
- Performance monitoring

### Backend Monitoring
- LLM response time tracking
- Error rate monitoring
- Usage analytics
- Model performance metrics
 
## Routing Map (Update 15/12/2025)
- Root `/`: hiển thị `LandingPage` render bởi `app/page.tsx`. Tham chiếu `medical-consultation-app/app/page.tsx:5`, `medical-consultation-app/components/landing-page.tsx:143`.
- `LandingPage` là client component, chứa hero và thẻ tính năng dẫn tới `/tu-van`, `/tra-cuu`, `/sang-loc`. Tham chiếu `medical-consultation-app/components/landing-page.tsx:169-179`, `medical-consultation-app/components/landing-page.tsx:207-211`.
- `/app` → redirect sang `/tu-van`. Tham chiếu `medical-consultation-app/app/app/page.tsx:3-5`.
- `/tu-van`: giao diện chat tư vấn y tế chính. Tham chiếu `medical-consultation-app/app/tu-van/page.tsx:1-9`.
- `/tam-su`: giao diện chat bạn thân. Tham chiếu `medical-consultation-app/app/tam-su/page.tsx:1-9`.

## GPU/CPU Switch Sync (Update 16/12/2025)
- Single Source of Truth: `medical-consultation-app/data/runtime-mode.json:1-5` giữ `target` và `gpu_url` hiện tại.
- Frontend Gateway `app/api/llm-chat/route.ts:41-68` ưu tiên đọc `runtime-mode.json`, fallback `server-registry.json` để chọn GPU URL.
- Fallback tự động: Khi GPU lỗi, gateway chuyển sang CPU (`internal FastAPI`) và ghi `runtime-events.jsonl` (`app/api/llm-chat/route.ts:117-125`).
- Metadata phản hồi: `app/api/llm-chat/route.ts:187-205` trả `mode`, `tier`, `fallback`, `model_init`, `rag` để UI đồng bộ `ComputeToggle` (`components/compute-toggle.tsx:30-54`).

## Health Lookup Category Panel (Update 16/12/2025)
- Data flow: Nút danh mục gọi proxy `/api/health-db/benh` hoặc `/api/health-db/thuoc`, backend phục vụ từ `server.py:/v1/benh` và `/v1/thuoc`.
- UI: Mở panel danh sách tên, click sẽ điền `searchQuery` và gọi `handleSearch` để truy vấn AI. Tham chiếu `components/health-lookup.tsx:292-381`.
- API chính: Tra cứu GPU-first với fallback CPU tại `server.py:1068-1323`; phản hồi kèm `mode` và có `redirect_url` khi không liên quan y tế.
