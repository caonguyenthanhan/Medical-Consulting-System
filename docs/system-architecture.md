# Kiến trúc Hệ thống Tư vấn Y tế AI

Tài liệu này mô tả chi tiết luồng dữ liệu và cơ chế xử lý của hệ thống, phản ánh chính xác mã nguồn hiện tại. Hệ thống sử dụng kiến trúc Hybrid linh hoạt giữa Next.js (Frontend/Gateway), Local FastAPI (CPU/Controller), và Cloud Colab (GPU/Intelligence).

```mermaid
flowchart TD
    %% Định nghĩa Style
    classDef user fill:#f9f,stroke:#333,stroke-width:2px,color:black;
    classDef frontend fill:#d4e1f5,stroke:#333,stroke-width:2px,color:black;
    classDef gateway fill:#ffe6cc,stroke:#333,stroke-width:2px,color:black;
    classDef local_backend fill:#d5e8d4,stroke:#82b366,stroke-width:2px,color:black;
    classDef cloud_backend fill:#f8cecc,stroke:#b85450,stroke-width:2px,color:black;
    classDef db fill:#e1d5e7,stroke:#9673a6,stroke-width:2px,color:black;

    %% User Interaction
    User((👤 Người dùng)):::user
    
    %% Frontend Layer
    subgraph Frontend ["🖥️ Frontend (Next.js 14)"]
        UI[Giao diện UI/UX]:::frontend
        ChatComp[Chat Interface<br/>(Tư vấn & Tâm sự)]:::frontend
        LookupComp[Health Lookup<br/>(Tra cứu Thuốc/Bệnh)]:::frontend
        
        UI --> ChatComp
        UI --> LookupComp
    end

    User <--> UI

    %% API Gateway Layer (Next.js)
    subgraph Gateway ["🚪 API Gateway (Next.js Routes)"]
        RouteChat[POST /api/llm-chat<br/>POST /api/tam-su-chat]:::gateway
        RouteLookup[POST /api/health-lookup<br/>GET /api/health-db/*]:::gateway
        
        SmartRouting{⚙️ Smart Routing<br/>(runtime-mode.json)}:::gateway
    end

    ChatComp --> RouteChat
    LookupComp --> RouteLookup
    RouteChat --> SmartRouting

    %% Local Backend Layer (Python)
    subgraph Local_Server ["🏠 Local Backend (server.py)"]
        FastAPI_Local[FastAPI Server]:::local_backend
        
        subgraph Local_Services [Local Services]
            Local_LLM[CPU LLM Service<br/>(Llama-cpp Quantized)]:::local_backend
            Lookup_Logic[Health Controller<br/>(Logic Tra cứu)]:::local_backend
            JSON_DB[(benh.json / thuoc.json)]:::db
            Local_RAG[Local RAG<br/>(LangChain + Chroma)]:::local_backend
            TTS_Proxy[TTS/STT Proxy]:::local_backend
        end
        
        FastAPI_Local --> Local_LLM
        FastAPI_Local --> Lookup_Logic
        FastAPI_Local --> TTS_Proxy
        Lookup_Logic --> JSON_DB
        Lookup_Logic -.-> Local_RAG
    end

    %% Cloud Backend Layer (GPU)
    subgraph Cloud_Server ["☁️ Cloud Backend (Colab GPU)"]
        Ngrok[Ngrok Tunnel]:::cloud_backend
        GPU_Service[GPU AI Service<br/>(Llama-3 Full / Llava / TTS)]:::cloud_backend
        
        Ngrok --> GPU_Service
    end

    %% Routing Flows
    
    %% Flow 1: Chat / Friend / Vision (Smart Routing)
    SmartRouting -- "Mode: GPU" --> Ngrok
    SmartRouting -- "Mode: CPU / Error" --> FastAPI_Local
    
    %% Flow 2: Health Lookup (Controller Flow)
    RouteLookup --> FastAPI_Local
    Lookup_Logic -- "1. Check Local JSON" --> JSON_DB
    Lookup_Logic -- "2. Not Found (Proxy)" --> Ngrok
    Lookup_Logic -- "3. Error/Fallback" --> Local_RAG

    %% Fallback Link for Chat
    Ngrok -.-> |"❌ Error / Timeout"| FastAPI_Local

    %% Note
    note1[Luồng Chat: Next.js tự định tuyến]
    note2[Luồng Tra cứu: Server.py làm trung tâm điều phối]
    
    style note1 fill:#fff2cc,stroke:#d6b656
    style note2 fill:#fff2cc,stroke:#d6b656
```

### Giải thích chi tiết các luồng dữ liệu

#### 1. Luồng Tư vấn AI & Bạn Tâm Giao (Smart Routing Flow)
*   **Điểm vào**: `/api/llm-chat` hoặc `/api/tam-su-chat`.
*   **Logic**: Next.js đọc cấu hình `runtime-mode.json`.
    *   **Trường hợp 1 (GPU Mode)**: Next.js gọi trực tiếp đến URL Ngrok của GPU Server. Đây là đường đi ngắn nhất để giảm độ trễ.
    *   **Trường hợp 2 (CPU Mode / Fallback)**: Nếu cấu hình là CPU hoặc gọi GPU thất bại, Next.js sẽ chuyển hướng gọi về `http://127.0.0.1:8000` (Local Server).
    *   **Local Server**: Sử dụng `llama-cpp-python` để chạy các model nén (Quantized) như Llama-3-1B, đảm bảo hệ thống vẫn hoạt động khi mất mạng.

#### 2. Luồng Tra cứu Y tế (Controller Flow)
*   **Điểm vào**: `/api/health-lookup` hoặc `/api/health-db/*`.
*   **Logic**: Next.js **LUÔN** gọi về Local Server (`server.py`).
*   **Tại sao?**: Vì dữ liệu nền (thuốc, bệnh) được lưu trữ cục bộ dưới dạng JSON để đảm bảo tốc độ và tính sẵn sàng offline.
*   **Quy trình xử lý tại Local Server**:
    1.  **Kiểm tra JSON Local**: Tìm kiếm trong `benh.json`, `thuoc.json`. Nếu có -> Trả về ngay.
    2.  **Proxy lên GPU**: Nếu không tìm thấy trong Local JSON và đang ở chế độ GPU -> Gọi lên GPU Server để AI trả lời sâu hơn.
    3.  **Fallback RAG**: Nếu GPU lỗi hoặc đang ở chế độ Offline -> Sử dụng Local RAG (LangChain + ChromaDB) để tra cứu trong dữ liệu vector nội bộ.

#### 3. Các thành phần dữ liệu
*   **JSON Files (`data/*.json`)**: Chứa dữ liệu tĩnh về thuốc và bệnh, cho phép tra cứu cực nhanh mà không cần AI.
*   **Runtime Config (`runtime-mode.json`)**: "Trái tim" của hệ thống routing, quyết định xem request sẽ đi đâu.
*   **Logs (`runtime-events.jsonl`)**: Ghi lại mọi sự kiện chuyển đổi mode, lỗi fallback để debug.
