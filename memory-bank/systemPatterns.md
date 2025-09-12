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

### Backend Architecture
```
Python LLM Service
├── Fine-tuned Llama Model
├── Adapter Directory (LoRA weights)
├── Model Inference Engine
└── API Interface
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

### Data Flow Patterns

#### 1. User Interaction Flow
```
User Input → Component State → API Call → LLM Processing → Response Display
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