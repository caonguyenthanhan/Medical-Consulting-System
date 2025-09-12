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

### Backend Technologies

#### AI/ML Stack
- **Llama 2/3**: Base language model
- **Hugging Face Transformers**: Model loading và inference
- **PyTorch**: Deep learning framework
- **LoRA (Low-Rank Adaptation)**: Efficient fine-tuning
- **Python 3.x**: Primary programming language

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
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

#### Python LLM Service
```bash
python -m pip install -r requirements.txt
python app.py   # Start LLM service
```

## Ràng buộc kỹ thuật

### Performance Requirements
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **LLM Response Time**: < 10s

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **No IE Support**: Modern web standards only

### Device Support
- **Desktop**: 1024px+ width
- **Tablet**: 768px - 1023px width
- **Mobile**: 320px - 767px width
- **Responsive Design**: Mobile-first approach

## Phụ thuộc chính

### Frontend Dependencies
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "@radix-ui/*": "Latest",
  "lucide-react": "Latest",
  "@vercel/analytics": "Latest"
}
```

### Python Dependencies
```python
torch>=2.0.0
transformers>=4.30.0
huggingface-hub>=0.15.0
peft>=0.4.0  # For LoRA
accelerator>=0.20.0
datasets>=2.12.0
```

### Development Dependencies
```json
{
  "@types/node": "^20.x",
  "@types/react": "^18.x",
  "eslint": "^8.x",
  "eslint-config-next": "^14.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x"
}
```

## Mẫu sử dụng công cụ

### Component Development
```typescript
// Sử dụng Shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Custom hooks pattern
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
```

### API Development
```typescript
// Next.js API routes pattern
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // API logic
  return NextResponse.json({ data })
}
```

### Styling Patterns
```typescript
// Tailwind CSS với conditional classes
const buttonClass = cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  className
)
```

## Configuration Files

### Next.js Config
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true
  }
}
```

### TypeScript Config
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

## Deployment Context

### Frontend Deployment
- **Platform**: Vercel (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

### Backend Deployment
- **Platform**: Cloud service với GPU support
- **Container**: Docker recommended
- **Model Storage**: Hugging Face Hub hoặc cloud storage
- **API Gateway**: For load balancing