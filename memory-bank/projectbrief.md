# Project Brief - Hệ thống Tư vấn Y tế AI

## Tổng quan dự án
Dự án luận văn tốt nghiệp tập trung phát triển hệ thống tư vấn y tế thông minh sử dụng mô hình Llama của Meta AI được fine-tuning trên dữ liệu y tế tiếng Việt.

## Mục tiêu chính
- Tạo công cụ hỗ trợ sức khỏe dễ tiếp cận
- Giúp người dùng chủ động trong việc tìm kiếm thông tin và quản lý sức khỏe cá nhân
- Hỗ trợ trong bối cảnh dịch vụ y tế chuyên sâu còn hạn chế

## Các tính năng cốt lõi

### 1. Trò chuyện và tư vấn sức khỏe
- Tư vấn tổng quát về triệu chứng, bệnh lý phổ biến, dược phẩm
- Giải đáp dễ hiểu và mang tính tham khảo
- Disclaimer rõ ràng về tính chất hỗ trợ

### 2. Công cụ sàng lọc tâm lý
- Sàng lọc thông minh dựa trên PHQ-9 (trầm cảm) và GAD-7 (lo âu)
- Nhận diện dấu hiệu từ câu chữ người dùng
- Giao diện khảo sát trực quan

### 3. Hệ thống đề xuất liệu pháp
- Đề xuất cá nhân hóa dựa trên triệu chứng/kết quả sàng lọc
- Liệu pháp không xâm lấn (thiền, yoga, CBT)
- Sản phẩm không kê đơn (vitamin, thực phẩm chức năng)
- Cảnh báo an toàn và khuyến nghị tham khảo chuyên gia

## Công nghệ sử dụng
- **Mô hình nền tảng**: Llama-2/Llama-3
- **Kỹ thuật**: Fine-tuning trên dữ liệu y tế tiếng Việt, Data Augmentation với Gemini
- **Dữ liệu**: Bộ dữ liệu y tế tiếng Việt từ Hugging Face/Kaggle, mental_health dataset
- **Framework**: Hugging Face Transformers, Python, PyTorch/TensorFlow
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS

## Thành viên nhóm
- 21110116 Cao Nguyễn Thành An (Leader)
- 21144449 Cao Thọ Phú Thịnh  
- 21110860 Trịnh Ngọc Anh Tuyên

## Phạm vi dự án
- Ứng dụng web responsive
- Tích hợp mô hình AI fine-tuned
- Giao diện người dùng thân thiện
- Hệ thống bảo mật thông tin người dùng
- Tuân thủ các tiêu chuẩn y tế và đạo đức AI