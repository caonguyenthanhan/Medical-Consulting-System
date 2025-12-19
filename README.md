# Hệ thống Tư vấn Y tế AI (Medical Consulting System)

Hệ thống Chatbot Tư vấn Y tế thông minh hỗ trợ người dùng tra cứu thông tin sức khỏe, sàng lọc tâm lý và tư vấn sơ bộ dựa trên kiến trúc Hybrid AI (kết hợp xử lý CPU cục bộ và GPU đám mây).

## 🚀 Tính Năng Nổi Bật

- **Tư vấn đa phương thức**: Hỗ trợ chat văn bản, giọng nói (Speech-to-Text/Text-to-Speech) và hình ảnh (Vision).
- **Kiến trúc Hybrid Linh hoạt**:
  - **Chế độ CPU (Local)**: Chạy nhẹ nhàng trên máy cá nhân cho các tác vụ cơ bản.
  - **Chế độ GPU (Cloud)**: Tự động chuyển tải sang Google Colab/GPU Server cho các mô hình nặng (RAG, Vision, TTS chất lượng cao).
- **RAG (Retrieval-Augmented Generation)**: Tra cứu thông tin y khoa chính xác từ cơ sở dữ liệu vector (ChromaDB) để giảm ảo giác AI.
- **Sàng lọc Tâm lý**: Tích hợp các bài test chuẩn y khoa (PHQ-9, GAD-7) để đánh giá sức khỏe tinh thần.
- **Chế độ Offline**: Tự động chuyển về xử lý cục bộ khi mất kết nối Internet hoặc Server GPU.

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Shadcn/UI, Tailwind CSS
- **State Management**: React Hooks, Server Actions

### Backend
- **Framework**: FastAPI (Python)
- **AI Engine**: Llama.cpp (Local LLM), Transformers (HuggingFace)
- **Vector DB**: ChromaDB
- **Speech**: gTTS (Google TTS), SpeechRecognition
- **Connectivity**: Ngrok (Tunneling cho Colab)

## 📦 Cài Đặt & Chạy Dự Án

### Yêu Cầu Tiên Quyết
- **Node.js**: v18 trở lên
- **Python**: 3.10 trở lên
- **Trình duyệt**: Chrome/Edge/Firefox mới nhất

### 1. Cài đặt Backend (Local Server)

```bash
# Tại thư mục gốc của dự án
pip install -r requirements.txt
```

### 2. Cài đặt Frontend

```bash
cd medical-consultation-app
npm install
```

## 🚀 Hướng Dẫn Chạy

### Bước 1: Khởi chạy Backend (Local API)
Mở một terminal tại thư mục gốc và chạy:

```bash
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```
*Server sẽ chạy tại: `http://127.0.0.1:8000`*

### Bước 2: Khởi chạy Frontend
Mở một terminal khác tại thư mục `medical-consultation-app` và chạy:

```bash
cd medical-consultation-app
npm run dev
```
*Truy cập ứng dụng tại: `http://localhost:3000`*

### Bước 3: Kết nối GPU Server (Tùy chọn - Khuyên dùng)
Để sử dụng các tính năng nâng cao (RAG, Vision, TTS xịn):
1. Upload thư mục `DB_ALL` và notebook `server_AI_MCS.ipynb` lên Google Drive.
2. Mở notebook trên Google Colab, kết nối GPU (T4).
3. Chạy các cell để khởi động server và lấy **Ngrok URL**.
4. Cập nhật URL vào file `medical-consultation-app/data/runtime-mode.json` hoặc nhập trực tiếp trên giao diện Web.

## 📂 Cấu Trúc Thư Mục

```
medical-consulting-system/
├── medical-consultation-app/   # Mã nguồn Frontend (Next.js)
├── server.py                   # Backend chính (FastAPI Local)
├── colab server/               # Script chạy trên Google Colab
├── RAG/                        # Logic xử lý RAG & Vector DB
├── data/                       # Dữ liệu mẫu (JSON, CSV)
├── models/                     # Chứa các file model GGUF (nếu chạy offline hoàn toàn)
├── requirements.txt            # Danh sách thư viện Python
└── README.md                   # Tài liệu hướng dẫn
```

## ⚠️ Lưu Ý Quan Trọng
- **Dữ liệu Y tế**: Các câu trả lời của AI chỉ mang tính chất tham khảo, **không thay thế lời khuyên của bác sĩ chuyên khoa**.
- **Bảo mật**: Không chia sẻ file `.env` hoặc URL Ngrok công khai.

## 👥 Tác Giả
Đồ án Tốt nghiệp - Hệ thống Tư vấn Y tế AI

- **21110116** - Cao Nguyễn Thành An (Leader)
- **21144449** - Cao Thọ Phú Thịnh
- **21110860** - Trịnh Ngọc Anh Tuyên

---
*© 2024 Medical Consulting System. All rights reserved.*
