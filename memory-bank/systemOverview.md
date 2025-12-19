# TỔNG QUAN HỆ THỐNG

## Mục tiêu & Nguyên tắc
- GPU-first: Ưu tiên xử lý trên GPU (Colab/Ngrok), tự động fallback CPU khi GPU lỗi.
- Đồng bộ trạng thái: UI luôn phản ánh đúng trạng thái Backend qua `runtime-mode.json`.
- Bảo mật & Offline: Không lộ token; khi offline, frontend tự đặt tiêu đề hội thoại tạm thời.
- Metadata bắt buộc: Mọi phản hồi chat kèm `mode`, `tier`, `fallback`, `model_init`, `rag` để UI hiển thị đúng chỉ báo.

## Kiến trúc Tổng thể
- Frontend: Next.js (App Router), TypeScript, Tailwind, Shadcn/ui.
- Gateway API (Frontend): `/api/llm-chat`, `/api/tam-su-chat`, `/api/health-lookup`, `/api/health-db/*`.
- Backend (FastAPI local): Chat, Friend Chat, Health Lookup (GPU-first + CPU fallback), Runtime Mode/State, TTS/STT/Vision.
- GPU Server (Colab): `server_ai_mcs.py` chạy LLM/VLM, RAG, TTS/STT, cung cấp `/v1/*` endpoints và `/gpu/metrics`.
- Data & Config: `runtime-mode.json` (source of truth), `server-registry.json` (GPU URLs), JSON y khoa (`benh.json`, `thuoc.json`).

## Luồng Dữ liệu Chính
- Tư vấn y tế (Chat): UI gửi qua Gateway `/api/llm-chat`, Backend gọi GPU `/v1/chat/completions`, lỗi thì fallback CPU (llama-cpp GGUF), trả metadata `mode`. Tham chiếu: `medical-consultation-app/app/api/llm-chat/route.ts:41-68,117-125,187-205`.
- Tâm sự (Friend Chat): UI gọi `/api/tam-su-chat`, Backend chuyển tới GPU `/v1/friend-chat/completions`, fallback CPU khi cần. Tham chiếu: `server.py:851-982`.
- Tra cứu y khoa (Health Lookup): Ưu tiên GPU `/v1/health-lookup`; nếu không, tra JSON nội bộ rồi RAG fallback. Tham chiếu: `server.py:1068-1323`.
- Danh mục nhanh (Bệnh/Thuốc): Frontend proxy `/api/health-db/benh|thuoc` → Backend `/v1/benh|/v1/thuoc` để hiển thị panel lựa chọn. Tham chiếu: `server.py:1324-1339`, `server.py:1341-1356`, `medical-consultation-app/components/health-lookup.tsx:311-381`.
- Đồng bộ chế độ & model: UI phát sự kiện `runtime_mode_changed` dựa trên phản hồi chat, `ComputeToggle` cập nhật theo sự kiện. Tham chiếu: `medical-consultation-app/components/compute-toggle.tsx:30-54`.

## Thiết kế Thành phần Frontend
- ChatInterface: Bố cục chống tràn cuộn theo nguyên tắc h-screen/flex-1/min-h-0/flex-shrink-0, container cố định chiều cao màn hình. Tham chiếu: `medical-consultation-app/components/chat-interface.tsx:1000-1060`.
- HealthLookup: 
  - Gợi ý tìm kiếm từ `/api/health-db/*`, lịch sử local, xử lý Markdown kết quả AI.
  - Danh mục nhanh (Bệnh/Thuốc) mở panel danh sách, click đổ `searchQuery` và gọi `handleSearch`. Tham chiếu: `medical-consultation-app/components/health-lookup.tsx:292-381`.
- ComputeToggle: Event-driven, đọc backend runtime state và metrics khi mount và khi nhận sự kiện. Tham chiếu: `medical-consultation-app/components/compute-toggle.tsx:12-28,30-54`.
- Tâm sự (Friend): Giao diện tương tự `/tu-van`, lịch sử riêng, hydrate-safe timestamps.

## Gateway API (Frontend)
- `/api/llm-chat`: 
  - Đọc `runtime-mode.json` (ưu tiên) hoặc `server-registry.json` để chọn GPU URL.
  - Gọi GPU `/v1/chat/completions` với header `X-Mode` (`flash`/`pro`); nếu lỗi, fallback CPU `INTERNAL_LLM_URL`.
  - Trả metadata đầy đủ: `mode`, `tier`, `fallback`, `model_init`, `rag`. 
  - Tham chiếu: `medical-consultation-app/app/api/llm-chat/route.ts:41-68,97-125,187-205`.

## Backend (FastAPI) Thiết kế
- Chat (`/v1/chat/completions`): GPU-first proxy tới Colab, fallback CPU llama-cpp; lazy-load GGUF khi cần; tự động đặt tiêu đề nếu rỗng. Tham chiếu: `server.py:691-850`.
- Friend Chat (`/v1/friend-chat/completions`): Proxy GPU friend-chat, fallback CPU; prompt bạn bè; lưu lịch sử riêng. Tham chiếu: `server.py:851-982`.
- Health Lookup (`/v1/health-lookup`): Phân loại truy vấn, tra JSON nội bộ bệnh/thuốc, fallback RAG, phản hồi kèm `mode` và `redirect_url` nếu không liên quan y tế. Tham chiếu: `server.py:1068-1323`.
- Danh mục dữ liệu (`/v1/benh`, `/v1/thuoc`): Trả danh sách từ `data/benh.json`, `data/thuoc.json` có lọc theo `q`. Tham chiếu: `server.py:1324-1339`, `server.py:1341-1356`.
- Runtime Mode/State: GET/POST cập nhật `target`, `gpu_url`, `model` theo global hoặc per-user; ghi `runtime-events.jsonl`. Tham chiếu: `server.py:585-618`, `server.py:619-690`.
- GPU Metrics: Trả thông số GPU hoặc fallback `nvidia-smi`. Tham chiếu: `server.py:1036-1066`.
- TTS/STT/Vision: Các endpoint streaming/ghép chunk; GPU-first cho vision; STT hỗ trợ chuyển đổi định dạng và chunk song song. Tham chiếu: `server.py:984-1035`, `server.py:1358-1563`, `server.py:1579-1819`.

## GPU Server (Colab) Thiết kế
- Chat/Vision/TTS/STT trên GPU, hỗ trợ `/gpu/metrics`.
- Tối ưu VRAM (4-bit, `device_map='auto'`), xử lý ngrok, health check. Tham chiếu: `colab server/demo/server_ai_mcs.py:399-422`.
- RAG: Embeddings và reranker, đọc từ Drive `DB_ALL`. Cập nhật phản hồi kèm `rag` khi dùng chế độ `pro`.

## Đồng bộ Trạng thái & Fallback
- Nguồn sự thật: `medical-consultation-app/data/runtime-mode.json` giữ `target`/`gpu_url` hiện tại.
- Fallback trình tự:
  - Gateway gọi GPU; nếu lỗi → thử CPU, ghi `runtime-events.jsonl` và cập nhật `runtime-mode.json` về `cpu`.
  - UI nhận metadata `mode` và phát `runtime_mode_changed` để cập nhật `ComputeToggle`.
- Đảm bảo consistent UI: mọi phản hồi đều trả `mode` để hiển thị indicator.

## Bảo mật & An toàn
- Disclaimer y tế, không kê đơn; khuyến cáo gặp bác sỹ khi cần.
- CORS mở cho các cổng dev đã định; không log token; tôn trọng offline logic UI.

## Phương Pháp Xây Dựng
- Thiết kế theo module: tách Frontend Gateway, Backend FastAPI, GPU Server.
- Event-driven UI: đồng bộ trạng thái qua sự kiện thay vì polling định kỳ.
- GPU-first mindset: mọi tính năng AI ưu tiên GPU, có fallback CPU mượt mà.
- Lazy-load mô hình CPU/VLM: chỉ khởi tạo khi cần, ghi sự kiện `cpu_model_loading/cpu_model_loaded`.
- Dữ liệu: tách JSON y khoa (`benh.json`, `thuoc.json`) khỏi mã nguồn; proxy qua API để bảo mật.
- Kiểm thử & xác minh:
  - Typecheck `npx tsc --noEmit` và build `npm run build` (PowerShell).
  - Kiểm thử thực tế các endpoint: `/v1/chat/completions`, `/v1/friend-chat/completions`, `/v1/health-lookup`.
  - Xem log `runtime-events.jsonl`, `runtime-metrics.jsonl` để đánh giá fallback/hiệu năng.

## Quy Trình Triển Khai & Chạy (PowerShell)
- Frontend: `cd medical-consultation-app; npm install; npm run dev`.
- Backend: `python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload`.
- GPU (Colab): mở notebook, mount Drive, set NGROK token, chạy server; cập nhật `server-registry.json` và/hoặc `runtime-mode.json`.

## Giám sát & Nhật ký
- `runtime-events.jsonl`: sự kiện chuyển mode, model change, GPU metrics.
- `runtime-metrics.jsonl`: thời gian phản hồi theo `mode`.
- `/gpu/metrics`: theo dõi sử dụng GPU và bộ nhớ.

## Hạn chế & Hướng Cải Tiến
- ESLint đã cấu hình tối thiểu với `eslint.config.js` (flat config) và parser TypeScript; có thể bổ sung rule set `next/core-web-vitals` sau.
- Type errors ở assessments đã khắc phục bằng `medical-consultation-app/types/assessment.ts:1-28`.
- RAG phụ thuộc môi trường; cần pin phiên bản và tối ưu tải tài nguyên.
