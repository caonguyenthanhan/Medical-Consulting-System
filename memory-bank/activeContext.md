# Active Context

## Current Focus
- Tối ưu hóa và sửa lỗi hệ thống Server AI (Colab) và Proxy (Local).
- **Mục tiêu chính:** Đảm bảo Server trên Colab khởi chạy ổn định, không bị crash do lỗi async, và tắt êm đẹp (Graceful Shutdown) khi người dùng dừng cell.

## Recent Changes
- **Backend (Server AI - Cell 6):**
  - **Graceful Shutdown:** Đã thêm xử lý `KeyboardInterrupt` cho khối khởi chạy server. Khi người dùng dừng cell trên Colab, hệ thống sẽ in thông báo "🛑 Server stopped by user" thay vì hiện traceback lỗi dài dòng.
  - **Fix Startup Crash:** Cải thiện logic khởi chạy server để tương thích tốt hơn với môi trường Colab (vốn đã có event loop chạy sẵn).
  - **Nest Asyncio:** Thêm cơ chế kiểm tra và cài đặt `nest_asyncio` tự động nếu thiếu, đảm bảo `loop.run_until_complete` hoạt động đúng.
  - **Error Handling:** Bổ sung try-except chi tiết cho khối khởi chạy server để log lỗi rõ ràng.
  - **Fix SyntaxError:** Thay thế `await server.serve()` bằng `loop.run_until_complete(server.serve())` khi chạy trong loop có sẵn.
- **Backend (Server Local - server.py):**
  - **Ngrok Header:** Đã kiểm tra và xác nhận header `ngrok-skip-browser-warning: true` đã có mặt trong tất cả các request proxy.
  - **Clean Code:** Thay thế `on_event("startup")` (deprecated) bằng `lifespan` handler để tránh cảnh báo DeprecationWarning.
- **Verification:**
  - **Colab Log:** Server khởi chạy thành công, log rõ ràng. Khi dừng cell, log hiện thông báo tắt server gọn gàng.
  - **Local Log:** Proxy hoạt động ổn định, chuyển hướng request tốt.
 - **Documentation:** README đã được cập nhật cho Windows/PowerShell, bổ sung danh sách endpoint GPU và hướng dẫn header Ngrok.

## Next Steps
- Tiếp tục theo dõi độ ổn định của kết nối Ngrok.
- Kiểm tra tính năng Vision Chat với ảnh.
- Rà soát lại logic xử lý file (PDF/Word) nếu có phản hồi lỗi từ người dùng.
 - Đồng bộ tài liệu và mã nguồn lên GitHub sau khi kiểm thử.

## Active Decisions
- **Async Strategy:** Sử dụng `nest_asyncio` là giải pháp bắt buộc để chạy uvicorn trong Colab notebook cell.
- **Proxy Headers:** Luôn include `ngrok-skip-browser-warning` để bypass trang interstitial của ngrok free tier.
- **FastAPI Lifespan:** Chuyển sang dùng `lifespan` context manager thay vì `on_event` để tuân thủ best practices mới nhất của FastAPI.
