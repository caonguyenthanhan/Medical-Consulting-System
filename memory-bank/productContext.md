# Product Context - Hệ thống Tư vấn Y tế AI

## Lý do tồn tại

### Vấn đề cần giải quyết
- **Khó tiếp cận dịch vụ y tế**: Nhiều người gặp khó khăn trong việc tiếp cận các dịch vụ y tế chuyên sâu
- **Thiếu thông tin sức khỏe đáng tin cậy**: Người dân thường tìm kiếm thông tin y tế từ các nguồn không chính xác
- **Sàng lọc tâm lý hạn chế**: Thiếu công cụ sàng lọc ban đầu về sức khỏe tâm thần
- **Ngôn ngữ tiếng Việt**: Hạn chế các công cụ AI y tế hỗ trợ tiếng Việt chất lượng cao

### Cơ hội thị trường
- Nhu cầu ngày càng tăng về chăm sóc sức khỏe số
- Sự phát triển của AI và machine learning trong y tế
- Xu hướng tự chăm sóc sức khỏe (self-care)
- Thiếu hụt nhân lực y tế tại Việt Nam

## Cách thức hoạt động

### Luồng người dùng chính
1. **Trang chủ**: Giới thiệu 3 tính năng chính với giao diện trực quan
2. **Tư vấn AI**: Chat với AI về các vấn đề sức khỏe
3. **Tra cứu Y khoa**: Tìm kiếm thông tin về bệnh lý, thuốc, triệu chứng
4. **Sàng lọc Tâm lý**: Thực hiện các bài test chuẩn PHQ-9, GAD-7

### Luồng mở rộng: Trò chuyện bằng giọng nói + hình ảnh
1. Người dùng chụp ảnh hoặc upload ảnh (thuốc, tờ hướng dẫn, nhãn hộp, chỉ số xét nghiệm)
2. Ghi âm câu hỏi (ví dụ: "thuốc này dùng để trị gì?")
3. Hệ thống chuyển giọng nói thành văn bản (STT), gửi cùng ảnh tới VLM qua `/v1/vision-chat`
4. AI trả lời ngữ cảnh y tế bằng tiếng Việt; nếu bật tự động phát, hệ thống chuyển văn bản thành giọng nói (TTS) và phát ngay
5. Ảnh và nội dung được hiển thị trong bong bóng chat để tiện theo dõi

### Trải nghiệm người dùng mong muốn
- **Dễ sử dụng**: Giao diện đơn giản, trực quan
- **Tin cậy**: Thông tin chính xác, có nguồn gốc rõ ràng
- **An toàn**: Bảo mật thông tin cá nhân, disclaimer rõ ràng
- **Hỗ trợ**: Luôn có AI sẵn sàng trả lời câu hỏi
- **Cá nhân hóa**: Đề xuất phù hợp với tình trạng cụ thể
- **Đa phương thức**: Hỏi bằng giọng nói, gửi kèm ảnh; phản hồi bằng văn bản và âm thanh

## Đối tượng người dùng

### Người dùng chính
- **Người trưởng thành (18-65 tuổi)** quan tâm đến sức khỏe
- **Sinh viên, nhân viên văn phòng** có áp lực công việc
- **Người có triệu chứng sức khỏe nhẹ** cần tư vấn ban đầu
- **Người quan tâm đến sức khỏe tâm thần**

### Nhu cầu người dùng
- Tìm hiểu về triệu chứng sức khỏe
- Đánh giá tình trạng tâm lý
- Tra cứu thông tin thuốc, bệnh lý
- Nhận đề xuất liệu pháp tự nhiên
- Quyết định có nên đến bác sĩ hay không

## Giá trị cốt lõi

### Cho người dùng
- **Tiết kiệm thời gian**: Tư vấn nhanh chóng 24/7
- **Tiết kiệm chi phí**: Giảm số lần khám không cần thiết
- **Tăng hiểu biết**: Nâng cao kiến thức về sức khỏe
- **Phát hiện sớm**: Sàng lọc các vấn đề tâm lý
- **An tâm**: Có thông tin đáng tin cậy để tham khảo

### Cho hệ thống y tế
- **Giảm tải**: Hỗ trợ tầm soát ban đầu
- **Nâng cao hiệu quả**: Người bệnh đến khám đã có thông tin cơ bản
- **Phòng ngừa**: Phát hiện sớm các vấn đề sức khỏe

## Nguyên tắc thiết kế

### Tính an toàn
- Luôn có disclaimer về tính chất tham khảo
- Khuyến khích tham khảo chuyên gia khi cần
- Không đưa ra chẩn đoán chính thức
- Bảo mật thông tin người dùng

### Tính chính xác
- Sử dụng dữ liệu y tế đáng tin cậy
- Fine-tuning mô hình trên dataset chất lượng
- Cập nhật thông tin thường xuyên
- Xác thực thông tin từ nhiều nguồn

### Tính dễ tiếp cận
- Giao diện đơn giản, trực quan
- Hỗ trợ tiếng Việt hoàn toàn
- Tương thích đa thiết bị
- Không yêu cầu kiến thức y tế chuyên sâu