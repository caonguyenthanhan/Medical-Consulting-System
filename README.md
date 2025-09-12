Ứng dụng mô hình Llama vào xây dựng hệ thống tư vấn y tế

1. Giới thiệu
   Dự án này là một luận văn tốt nghiệp, tập trung vào việc phát triển một hệ thống tư vấn y tế thông minh. Ứng dụng sử dụng sức mạnh của các mô hình ngôn ngữ lớn (LLM), đặc biệt là mô hình Llama của Meta AI, để cung cấp cho người dùng các chức năng tra cứu thông tin y khoa, sàng lọc ban đầu về các vấn đề tâm lý, và đề xuất các liệu pháp hoặc sản phẩm phù hợp.

Mục tiêu chính là tạo ra một công cụ hỗ trợ sức khỏe dễ tiếp cận, giúp người dùng chủ động hơn trong việc tìm kiếm thông tin và quản lý sức khỏe cá nhân, đặc biệt là trong bối cảnh các dịch vụ y tế chuyên sâu còn nhiều hạn chế.

2. Các tính năng chính
   Dự án này tích hợp ba tính năng cốt lõi, được xây dựng dựa trên mô hình Llama đã được tinh chỉnh (fine-tuning) trên dữ liệu y tế tiếng Việt:

2.1. Trò chuyện và tư vấn sức khỏe
Tư vấn tổng quát: Người dùng có thể trò chuyện với mô hình để mô tả các triệu chứng, đặt câu hỏi về các bệnh lý phổ biến hoặc dược phẩm. Mô hình sẽ đưa ra các giải đáp một cách dễ hiểu và mang tính tham khảo.

Disclaimer: Luôn hiển thị thông báo rõ ràng rằng đây là công cụ hỗ trợ, không thể thay thế cho chẩn đoán và lời khuyên của bác sĩ chuyên nghiệp.

2.2. Công cụ sàng lọc ban đầu về tâm lý
Sàng lọc thông minh: Dựa trên các tiêu chuẩn y khoa như thang đo PHQ-9 (trầm cảm) và GAD-7 (lo âu), hệ thống có thể nhận diện các dấu hiệu lo âu hoặc trầm cảm từ câu chữ của người dùng và chủ động đưa ra các câu hỏi sàng lọc.

Giao diện trực quan: Các câu hỏi sàng lọc được hiển thị dưới dạng khảo sát đơn giản, giúp người dùng dễ dàng đánh giá tình trạng của mình.

2.3. Hệ thống đề xuất liệu pháp và sản phẩm
Đề xuất cá nhân hóa: Dựa trên các triệu chứng hoặc kết quả sàng lọc, hệ thống sẽ đưa ra các đề xuất về liệu pháp không xâm lấn (ví dụ: thiền, yoga, liệu pháp nhận thức hành vi) hoặc các sản phẩm không kê đơn (ví dụ: vitamin, trà thảo dược) để cải thiện sức khỏe.

Cảnh báo an toàn: Các đề xuất này luôn đi kèm với lời khuyên nên tham khảo ý kiến bác sĩ hoặc chuyên gia trước khi áp dụng.

3. Công nghệ sử dụng
   Mô hình nền tảng: Llama (phiên bản Llama-2 hoặc Llama-3).

Kỹ thuật chính:

Fine-tuning: Tinh chỉnh mô hình Llama trên các bộ dữ liệu y tế tiếng Việt để nâng cao độ chính xác và khả năng hiểu ngữ cảnh chuyên ngành.

Data Augmentation: Sử dụng các LLM khác (ví dụ: Gemini) để tạo ra dữ liệu hội thoại tổng hợp, giúp tăng cường hiệu quả huấn luyện.

Dữ liệu huấn luyện:

Các bộ dữ liệu y tế tiếng Việt công khai trên Hugging Face và Kaggle.

Dữ liệu về sàng lọc tâm lý như phamxuankhoa/mental\_health.

Framework và Thư viện:

Hugging Face Transformers: Để tải, tinh chỉnh và sử dụng mô hình Llama.

Python: Ngôn ngữ lập trình chính.

PyTorch/TensorFlow: Các framework học sâu.

4. Cài đặt và triển khai
   Chi tiết về cách cài đặt, chạy ứng dụng và triển khai mô hình sẽ được cập nhật sau khi hoàn thành dự án.
5. Đóng góp và Hướng phát triển
   Dự án này kỳ vọng sẽ đóng góp một mô hình AI tư vấn y tế tiếng Việt chất lượng cao cho cộng đồng. Trong tương lai, hệ thống có thể được mở rộng với các tính năng:

Tích hợp tính năng đa phương thức (phân tích hình ảnh X-quang, MRI).

Tối ưu hóa hệ thống để xử lý các cuộc hội thoại phức tạp hơn.

Phát triển giao diện ứng dụng di động để tiếp cận nhiều người dùng hơn.

6. Liên hệ
   21110116  Cao Nguyễn Thành An (Leader)
   21144449  Cao Thọ Phú Thịnh
   21110860  Trịnh Ngọc Anh Tuyên
