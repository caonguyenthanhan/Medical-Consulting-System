# Kiến trúc Hệ thống Tư vấn Y tế AI

Tài liệu này mô tả luồng hoạt động chi tiết của hệ thống, bao gồm cơ chế Hybrid (Local CPU + Cloud GPU) và các phân hệ chức năng chính.

```mermaid
flowchart TD
    %% Định nghĩa Style
    classDef user fill:#f9f,stroke:#333,stroke-width:2px,color:black;
    classDef frontend fill:#d4e1f5,stroke:#333,stroke-width:2px,color:black;
    classDef gateway fill:#ffe6cc,stroke:#333,stroke-width:2px,color:black;
    classDef backend_cpu fill:#d5e8d4,stroke:#82b366,stroke-width:2px,color:black;
    classDef backend_gpu fill:#f8cecc,stroke:#b85450,stroke-width:2px,color:black;
    classDef db fill:#e1d5e7,stroke:#9673a6,stroke-width:2px,color:black;

    %% User Interaction
    User((👤 Người dùng)):::user
    
    %% Frontend Layer
    subgraph Frontend ["🖥️ Frontend (Next.js 14)"]
        UI[Giao diện UI/UX]:::frontend
        ChatComp[Chat Interface]:::frontend
        VisionComp[Vision Chat]:::frontend
        LookupComp[Tra cứu Thuốc/Bệnh]:::frontend
        ScreeningComp[Sàng lọc Tâm lý]:::frontend
        FriendComp[Bạn Tâm Giao]:::frontend
        
        UI --> ChatComp
        UI --> VisionComp
        UI --> LookupComp
        UI --> ScreeningComp
        UI --> FriendComp
    end

    User <--> UI

    %% API Gateway Layer
    subgraph Gateway ["🚪 API Gateway (Next.js API Routes)"]
        RouteLLM[POST /api/llm-chat]:::gateway
        RouteTamSu[POST /api/tam-su-chat]:::gateway
        RouteVision[POST /api/vision-chat]:::gateway
        
        RuntimeCheck{⚙️ Kiểm tra Mode<br>(runtime-mode.json)}:::gateway
    end

    ChatComp --> RouteLLM
    VisionComp --> RouteVision
    LookupComp --> RouteLLM
    FriendComp --> RouteTamSu
    ScreeningComp --> RouteLLM

    RouteLLM --> RuntimeCheck
    RouteTamSu --> RuntimeCheck
    RouteVision --> RuntimeCheck

    %% Backend Layer - Local CPU
    subgraph Local_CPU ["🏠 Local Backend (FastAPI - CPU)"]
        FastAPI_CPU[Server.py]:::backend_cpu
        
        subgraph CPU_Services [Services]
            CPU_Chat[Llama-cpp-python<br>(Quantized Model)]:::backend_cpu
            CPU_RAG[Simple RAG<br>(SQLite Search)]:::backend_cpu
            CPU_Logic[Screening Logic<br>(PHQ-9/GAD-7)]:::backend_cpu
        end
        
        FastAPI_CPU --> CPU_Services
    end

    %% Backend Layer - Cloud GPU
    subgraph Cloud_GPU ["☁️ Cloud Backend (Google Colab - GPU)"]
        Ngrok_Tunnel[Ngrok Tunnel]:::backend_gpu
        Colab_Server[Server AI MCS]:::backend_gpu
        
        subgraph GPU_Services [Services]
            GPU_LLM[Llama-3 (Full Precision)<br>High Intelligence]:::backend_gpu
            GPU_Vision[Llava-v1.5<br>Image Analysis]:::backend_gpu
            GPU_TTS[Fast TTS<br>Streaming Audio]:::backend_gpu
            GPU_RAG[Advanced RAG<br>Vector Search]:::backend_gpu
        end
        
        Ngrok_Tunnel --> Colab_Server
        Colab_Server --> GPU_Services
    end

    %% Data Layer
    subgraph Data ["💾 Data Persistence"]
        SQLite[(SQLite DB)]:::db
        ChromaDB[(Chroma Vector DB)]:::db
        Logs[Logs & Metrics]:::db
    end

    %% Routing Logic
    RuntimeCheck -- "Mode: GPU & Online" --> Ngrok_Tunnel
    RuntimeCheck -- "Mode: CPU or Offline" --> FastAPI_CPU
    
    %% Fallback Mechanism
    Ngrok_Tunnel -.-> |"❌ Error / Timeout"| FastAPI_CPU
    
    %% Data Access
    CPU_Services --> SQLite
    GPU_Services --> ChromaDB
    
    %% Note
    note1[⚡ Flash Mode = CPU<br>🚀 Pro Mode = GPU]
    
    style note1 fill:#fff2cc,stroke:#d6b656,stroke-dasharray: 5 5
```

### Giải thích các luồng chính:

1.  **Chuyển đổi Mode (Flash/Pro)**:
    *   API Gateway đọc file `runtime-mode.json`.
    *   Nếu mode là `gpu` và server GPU phản hồi -> Gọi qua Ngrok.
    *   Nếu mode là `cpu` hoặc server GPU lỗi -> Gọi về Local FastAPI (Fallback).

2.  **Các phân hệ chức năng**:
    *   **Tư vấn & Tra cứu**: Sử dụng LLM để trả lời. GPU dùng model lớn (Llama-3), CPU dùng model nhỏ (Quantized).
    *   **Sàng lọc Tâm lý**: Xử lý logic tính điểm trên CPU, nhưng có thể dùng GPU để phân tích kết quả sâu hơn.
    *   **Bạn Tâm Giao**: Một phiên bản Chatbot với System Prompt đặc biệt ("người bạn lắng nghe"), ưu tiên chạy trên GPU để có độ phản hồi cảm xúc tốt hơn.
    *   **Vision Chat**: Gửi ảnh + text lên GPU (Llava model) để phân tích. Nếu mất GPU, tính năng này có thể bị vô hiệu hóa hoặc trả về thông báo lỗi (do CPU khó chạy Vision model nặng).

3.  **Dữ liệu**:
    *   SQLite lưu trữ dữ liệu thuốc, bệnh cơ bản.
    *   ChromaDB (trên Cloud/Local RAG) lưu trữ vector embeddings cho tra cứu nâng cao.
