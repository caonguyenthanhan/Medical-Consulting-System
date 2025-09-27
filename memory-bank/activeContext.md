# Active Context - Hệ thống Tư vấn Y tế AI

## Trọng tâm công việc hiện tại

### Vấn đề chính đã được giải quyết
**LATEST CONFIRMED** (28/01/2025): ✅ Complete bug fixes và smart features enhancement

**Xác nhận và cải thiện mới nhất**:
1. ✅ **FAQ Questions Restored**: 
   - Fixed missing suggested questions trong chat interface
   - Changed display logic từ `messages.length === 0` thành `messages.length === 1`
   - Suggested questions hiện hiển thị properly với initial AI message
2. ✅ **API Error Handling Enhanced**:
   - Gemini API 503 Service Unavailable được xử lý với retry logic
   - Exponential backoff strategy (2s, 4s, 8s) cho rate limiting
   - Comprehensive fallback responses cho mỗi context
   - Improved error logging và debugging information
3. ✅ **Health Lookup Scrolling Fixed**:
   - Changed từ `min-h-screen` thành `h-full overflow-y-auto`
   - Added `WebkitOverflowScrolling: 'touch'` và `scrollBehavior: 'smooth'`
   - Enhanced gradient background cho better visual appeal
   - Mobile-optimized scrolling experience
4. ✅ **Smart Question Suggestion System**:
   - Context-aware suggestions dựa theo conversation history
   - Dynamic question categories: pain, mental, medication, prevention
   - Intelligent keyword detection trong recent messages
   - Adaptive suggestions theo user interaction patterns
5. ✅ **Previous Mobile Enhancements**:
   - Mobile app-like interface với smooth scrolling
   - Logo update thành `medical-logo.png`
   - Touch-friendly interactions và gradient backgrounds
   - React errors fixed và stable runtime

**Trước đây**: ✅ Syntax errors và Gemini API integration đã được giải quyết (27/09/2024)

## Những thay đổi gần đây

### Cấu trúc dự án hiện tại
- ✅ Frontend Next.js app đã được thiết lập
- ✅ Components cơ bản đã được tạo
- ✅ UI library (Shadcn/ui) đã được cấu hình
- ✅ TypeScript configuration hoàn tất
- ✅ Dependencies đã được cài đặt thành công
- ✅ Build system hoạt động bình thường
- ✅ Development server chạy ổn định

### Tính năng đã triển khai
1. **Landing Page**: Giao diện chính với 3 tính năng
2. **Chat Interface**: Component tư vấn AI
3. **Health Lookup**: Tra cứu thông tin y tế
4. **Psychological Screening**: Sàng lọc tâm lý với PHQ-9, GAD-7
5. **AI Chat Box**: Component tái sử dụng cho nhiều context

## Các bước tiếp theo

### Ưu tiên cao (Immediate) - COMPLETED ✅
1. **✅ Khắc phục lỗi syntax và API**:
   - ✅ Sửa lỗi syntax trong psychological-screening.tsx và health-lookup.tsx
   - ✅ Cập nhật Gemini API configuration (model, version, authentication)
   - ✅ Test API functionality thành công
   - ✅ Ứng dụng chạy ổn định không lỗi

2. **✅ Kiểm tra môi trường phát triển**:
   - ✅ Development server chạy thành công
   - ✅ Ứng dụng accessible tại localhost:3000
   - ✅ No runtime errors detected
   - ✅ API endpoints hoạt động bình thường

### Ưu tiên trung bình (Next) - COMPLETED ✅
1. **✅ LLM Integration**:
   - ✅ API endpoints đã được cấu trúc lại
   - ✅ Frontend components đã được cập nhật để khớp với API response structure
   - ✅ **Gemini API integration hoàn thành và hoạt động** (LATEST UPDATE)
   - ✅ API key configuration và authentication với x-goog-api-key header
   - ✅ Model selection và optimization (gemini-2.5-flash với v1beta API)
   - ✅ Rate limiting và retry logic implementation
   - ✅ Real AI responses từ Google Gemini API
   - ✅ Context-aware prompts cho từng tính năng
   - ✅ Error handling và fallback responses
   - ✅ Logging system cải thiện để debug
   - ✅ API response đầy đủ và không bị cắt ngắn

2. **Data Integration** (Next Priority):
   - Load health data for lookup
   - Implement assessment scoring
   - Add real medical information

### Ưu tiên thấp (Later) - PARTIALLY COMPLETED ✅
1. **✅ UI/UX Improvements**:
   - ✅ Modern design implementation với gradient backgrounds
   - ✅ Enhanced visual elements (icons, animations, hover effects)
   - ✅ Improved user experience với better spacing và typography
   - ✅ Responsive design elements
   - 🔄 Accessibility improvements (ongoing)
   - 🔄 Performance optimization (ongoing)

2. **Advanced Features**:
   - User session management
   - Data persistence
   - Advanced analytics

## Quyết định và cân nhắc đang hoạt động

### Package Manager Choice
- **Hiện tại**: Dự án có `pnpm-lock.yaml` → nên sử dụng pnpm
- **Vấn đề**: User đang chạy npm commands
- **Giải pháp**: Chuyển sang pnpm hoặc regenerate npm lock file

### Development Environment
- **OS**: Windows (PowerShell)
- **Node.js**: Cần verify version
- **Package Manager**: pnpm preferred, npm fallback

### API Architecture
- **Current**: Mock responses trong `/api/llm-chat/route.ts`
- **Target**: Real Python LLM service integration
- **Challenge**: Cross-platform deployment

## Các mẫu và sở thích quan trọng

### Code Patterns
1. **Component Structure**:
   ```typescript
   // Feature-based components với shared AiChatBox
   <FeatureComponent>
     <SpecificUI />
     <AiChatBox context="feature-specific" />
   </FeatureComponent>
   ```

2. **State Management**:
   ```typescript
   // Local state với TypeScript
   const [activeTab, setActiveTab] = useState<ActiveTab>('home')
   ```

3. **API Pattern**:
   ```typescript
   // Consistent request/response structure
   { prompt, context, question } → { response, confidence?, sources? }
   ```

### UI/UX Preferences
- **Design System**: Shadcn/ui với Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Geist font family
- **Color Scheme**: Healthcare-friendly colors
- **Layout**: Card-based design với clear navigation

## Bài học kinh nghiệm

### Những gì hoạt động tốt
1. **Component Architecture**: Modular design với shared components
2. **TypeScript Integration**: Strong typing giúp development
3. **UI Library**: Shadcn/ui cung cấp consistent design
4. **File Structure**: Clear separation of concerns

### Những thách thức
1. **Dependency Management**: Package manager conflicts
2. **Environment Setup**: Cross-platform compatibility
3. **LLM Integration**: Complex AI service integration
4. **Data Management**: Mock vs real data transition

### Hiểu biết sâu sắc về dự án
1. **Medical AI Complexity**: Cần balance giữa helpful và safe
2. **Vietnamese Language**: Specialized dataset requirements
3. **User Trust**: Critical cho healthcare applications
4. **Regulatory Compliance**: Medical disclaimers essential

## Trạng thái hiện tại của từng module

### Frontend (Next.js App)
- **Status**: 🔴 Broken (build issues)
- **Completion**: 70% (UI done, functionality needs LLM)
- **Blockers**: Dependency installation

### Backend (Python LLM)
- **Status**: 🟡 In Development
- **Completion**: 30% (mock responses only)
- **Blockers**: Model fine-tuning, deployment setup

### Data Layer
- **Status**: 🟡 Mock Data
- **Completion**: 40% (structure defined, real data needed)
- **Blockers**: Dataset integration

### Deployment
- **Status**: 🔴 Not Ready
- **Completion**: 10% (configs exist, not tested)
- **Blockers**: Build issues, LLM service setup

## Immediate Action Items
1. [x] Add memory-bank to .gitignore ✅
2. [x] Configure LoRA model path in llm-config.ts ✅
3. [x] Fix JavaScript strip() to trim() in parseModelResponse ✅
4. [x] Update route.ts to use actual model logic instead of mock responses ✅
5. Fix npm/pnpm dependency issues
6. Verify Next.js installation
7. Test development server
8. Validate all components render correctly
9. Implement Python LLM service integration