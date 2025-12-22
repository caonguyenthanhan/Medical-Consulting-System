# Tech Context - Hệ thống Tư vấn Y tế AI

## Công nghệ đã sử dụng

### Frontend Technologies

#### Core Framework
- **Next.js 14**: React framework với App Router
- **React 18**: UI library với hooks và concurrent features
- **TypeScript**: Static type checking

#### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Component library built on Radix UI
- **Radix UI**: Headless UI components
- **Lucide React**: Icon library
- **Geist Font**: Typography (Sans & Mono)

#### State Management & Hooks
- **React Hooks**: useState, useEffect cho local state
- **Custom Hooks**: use-mobile.ts, use-toast.ts
- **React Hook Form**: Form handling với validation

#### Audio/Camera APIs
- **MediaRecorder API**: Ghi âm `audio/webm;codecs=opus` cho STT
- **getUserMedia(video)**: Mở camera, chụp ảnh và chuyển sang base64

### Backend Technologies

#### AI/ML Stack
- **Llama 2/3**: Base language model
- **Hugging Face Transformers**: Model loading và inference
- **PyTorch**: Deep learning framework
- **LoRA (Low-Rank Adaptation)**: Efficient fine-tuning
- **Python 3.x**: Primary programming language
- **llama.cpp/gguf**: Runtime nạp model `.gguf` cho text và vision
- **pypdf**: PDF processing library
- **python-docx**: Microsoft Word (.docx) processing library

#### Data Processing
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning utilities

### Development Tools

#### Package Management
- **pnpm**: Fast, disk space efficient package manager
- **npm**: Fallback package manager

#### Build Tools
- **Next.js Build System**: Webpack-based bundling
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

#### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking

## Thiết lập phát triển

### Cấu trúc dự án
```
medical-consultation-app/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                # Utilities và configurations
├── hooks/              # Custom React hooks
├── public/             # Static assets
├── styles/             # Global styles
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── next.config.mjs     # Next.js config
├── postcss.config.mjs  # PostCSS config
└── components.json     # Shadcn/ui config
```

### Environment Setup

#### Node.js Environment
- **Node.js**: v18+ required
- **pnpm**: v8+ recommended
- **TypeScript**: v5+

#### Python Environment
- **Python**: 3.8+
- **CUDA**: For GPU acceleration (optional)
- **Virtual Environment**: Recommended

### Scripts và Commands

#### Development
```powershell
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Tooling Preference (Update 16/12/2025)
- Ưu tiên `npm` và `npx` trong môi trường Windows PowerShell cho phát triển frontend.
