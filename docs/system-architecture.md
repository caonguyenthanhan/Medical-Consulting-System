# Kiến trúc Hệ thống Tư vấn Y tế AI (System Architecture)

Hệ thống được thiết kế theo mô hình **Hybrid AI**, kết hợp sức mạnh xử lý tức thời của Local CPU và khả năng tri thức sâu rộng của Cloud GPU.

## Sơ đồ Kiến trúc Tổng quan (Mermaid Chart)

```mermaid
flowchart TD
    %% --- ĐỊNH NGHĨA STYLE ---
    classDef user fill:#f9f,stroke:#333,stroke-width:2px,color:black;
    classDef frontend fill:#d4e1f5,stroke:#333,stroke-width:2px,color:black;
    classDef gateway fill:#ffe6cc,stroke:#333,stroke-width:2px,color:black;
    classDef local_backend fill:#d5e8d4,stroke:#82b366,stroke-width:2px,color:black;
    classDef cloud_backend fill:#f8cecc,stroke:#b85450,stroke-width:2px,color:black;
    classDef data fill:#e1d5e7,stroke:#9673a6,stroke-width:2px,color:black;

    %% --- 1. USER INTERACTION ---
    User(("👤 Người dùng")):::user

    %% --- 2. FRONTEND LAYER (Next.js 14) ---
    subgraph Frontend ["🖥️ Frontend Layer (Next.js 14 App Router)"]
        direction TB
        UI_Core["Giao diện Chính"]:::frontend
        
        subgraph Components ["Functional Components"]
            ChatComp["💬 Chat Interface<br/>(Tư vấn & Tâm sự)"]:::frontend
            LookupComp["💊 Health Lookup<br/>(Tra cứu Thuốc/Bệnh)"]:::frontend
            PsychComp["🧠 Psychological Screening<br/>(Sàng lọc PHQ-9/GAD-7)"]:::frontend
            MultiModal["📷 Speech & Vision<br/>(Voice Chat / Phân tích ảnh)"]:::frontend
        end
        
        UI_Core --> ChatComp
        UI_Core --> LookupComp
        UI_Core --> PsychComp
        UI_Core --> MultiModal
    end
    
    User <--> UI_Core

    %% --- 3. API GATEWAY LAYER (Next.js API Routes) ---
    subgraph Gateway ["🚪 API Gateway Layer"]
        direction TB
        RouteChat["POST /api/llm-chat<br/>POST /api/tam-su-chat"]:::gateway
        RouteLookup["POST /api/health-lookup"]:::gateway
        RouteSpeech["POST /api/speech-chat"]:::gateway
        
        Router{"⚙️ Smart Routing<br/>(runtime-mode.json)"}:::gateway
    end

    ChatComp --> RouteChat
    PsychComp --> RouteChat
    LookupComp --> RouteLookup
    MultiModal --> RouteSpeech
    
    RouteChat --> Router
    RouteSpeech --> Router

    %% --- 4. LOCAL BACKEND LAYER (CPU) ---
    subgraph Local_System ["🏠 Local Backend System (server.py)"]
        FastAPI_Local["FastAPI Controller"]:::local_backend
        
        subgraph Local_Intelligence ["Local Intelligence (CPU)"]
            Local_LLM["🤖 Local LLM Service<br/>(Llama-3.2-1B Quantized)"]:::local_backend
            Local_RAG["📚 Local RAG Engine<br/>(LangChain + ChromaDB)"]:::local_backend
            Lookup_Engine["🔎 Lookup Logic<br/>(Offline-First)"]:::local_backend
            Data_JSON[("📂 benh.json / thuoc.json")]:::data
        end
    end

    %% --- 5. CLOUD BACKEND LAYER (GPU) ---
    subgraph Cloud_System ["☁️ Cloud Backend System (Google Colab)"]
        Ngrok_Tunnel["Ngrok Secure Tunnel"]:::cloud_backend
        
        subgraph Cloud_Intelligence ["Cloud Intelligence (T4 GPU)"]
            GPU_LLM["🧠 Advanced LLM Service<br/>(Llama-3 Full / Fine-tuned)"]:::cloud_backend
            Vision_Model["👁️ Vision Model<br/>(Llava v1.5)"]:::cloud_backend
            TTS_Engine["🗣️ TTS/STT Engine<br/>(Fast Whisper / XTTS)"]:::cloud_backend
        end
    end

    %% --- DATA FLOWS & CONNECTIONS ---

    %% Flow 1: Smart Routing (Chat / Speech / Vision)
    Router -- "Mode: GPU (Priority)" --> Ngrok_Tunnel
    Router -- "Mode: CPU / Fallback" --> FastAPI_Local

    %% Flow 2: Health Lookup (Controller Pattern)
    RouteLookup --> FastAPI_Local
    FastAPI_Local --> Lookup_Engine
    Lookup_Engine -- "1. Check Static Data" --> Data_JSON
    Lookup_Engine -- "2. Not Found (Proxy)" --> Ngrok_Tunnel
    Lookup_Engine -- "3. Fallback RAG" --> Local_RAG

    %% Flow 3: Cloud Processing
    Ngrok_Tunnel --> GPU_LLM
    Ngrok_Tunnel --> Vision_Model
    Ngrok_Tunnel --> TTS_Engine
    
    %% Flow 4: Local Processing
    FastAPI_Local --> Local_LLM
    
    %% Fallback Mechanism
    Ngrok_Tunnel -.-> |"❌ Connection Lost"| FastAPI_Local
```

## Giải thích chi tiết các thành phần (Theo Memory Bank)

### 1. Frontend Layer (Next.js)
Được xây dựng dựa trên **Next.js 14 App Router**, đảm nhiệm vai trò giao diện người dùng và điều phối logic hiển thị.
*   **Chat Interface**: Giao diện chat chính, hỗ trợ các chế độ `Flash` (nhanh), `Pro` (thông minh), và `Tâm sự` (bạn bè).
*   **Health Lookup**: Module tra cứu y khoa chuyên biệt, ưu tiên dữ liệu tĩnh để phản hồi tức thì.
*   **Psychological Screening**: Các bài test PHQ-9/GAD-7 để đánh giá sức khỏe tinh thần, kết quả có thể được dùng làm đầu vào cho Chat Interface tư vấn tiếp.
*   **Speech & Vision**: Module đa phương thức mới, cho phép chat bằng giọng nói (STT/TTS) và gửi ảnh để AI phân tích (Vision Chat).

### 2. API Gateway & Smart Routing
Lớp trung gian xử lý logic định tuyến thông minh:
*   **Smart Routing**: Dựa vào file cấu hình `runtime-mode.json` để quyết định request sẽ được xử lý ở đâu.
*   **Cơ chế Fallback**: Tự động chuyển từ GPU về CPU nếu kết nối Cloud bị gián đoạn, đảm bảo tính sẵn sàng cao (High Availability).

### 3. Local Backend (CPU - Offline Capable)
Hoạt động trên máy cá nhân người dùng, đảm bảo các tính năng cơ bản luôn hoạt động ngay cả khi không có Internet hoặc GPU Server.
*   **Local LLM**: Sử dụng `llama-cpp-python` chạy model nén (`Llama-3.2-1B-Instruct-Q6_K_L.gguf`), đủ nhẹ để chạy trên CPU thường.
*   **Lookup Engine**: Logic tra cứu ưu tiên tìm trong file JSON (`benh.json`, `thuoc.json`) trước khi hỏi AI, giúp phản hồi cực nhanh.
*   **Local RAG**: Hệ thống tìm kiếm vector (ChromaDB) giúp AI trả lời dựa trên dữ liệu y tế đã được index.

### 4. Cloud Backend (GPU - Intelligence)
Chạy trên Google Colab (hoặc server GPU rời), cung cấp sức mạnh xử lý cho các tác vụ nặng.
*   **Advanced LLM**: Chạy các model lớn hơn, đầy đủ hơn (Full precision hoặc ít nén hơn) cho câu trả lời sâu sắc.
*   **Vision Model**: Sử dụng `llava-v1.5-7b` để "nhìn" và hiểu hình ảnh thuốc/bệnh lý.
*   **TTS/STT Engine**: Xử lý giọng nói chất lượng cao với độ trễ thấp.
