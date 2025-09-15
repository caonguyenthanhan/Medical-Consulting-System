import { Assessment } from '../types/assessment'

export const phq9Assessment: Assessment = {
  id: "phq9",
  title: "PHQ-9 - Sàng lọc Trầm cảm",
  description: "Bộ câu hỏi chuẩn để đánh giá mức độ trầm cảm trong 2 tuần qua",
  questions: [
    {
      id: "phq9-1",
      text: "Ít hứng thú hoặc không thấy vui vẻ khi làm mọi việc",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-2",
      text: "Cảm thấy buồn bã, chán nản, hoặc vô vọng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-3",
      text: "Khó đi vào giấc ngủ, ngủ không yên giấc, hoặc ngủ quá nhiều",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-4",
      text: "Cảm thấy mệt mỏi hoặc không có năng lượng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-5",
      text: "Ăn không ngon hoặc ăn quá nhiều",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-6",
      text: "Cảm thấy tồi tệ về bản thân, cho rằng mình là người thất bại hoặc đã làm gia đình và bản thân thất vọng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-7",
      text: "Khó tập trung vào việc gì đó, ví dụ như đọc báo hoặc xem TV",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-8",
      text: "Di chuyển hoặc nói chuyện chậm chạp đến mức người khác có thể nhận thấy? Hoặc ngược lại, bồn chồn, đứng ngồi không yên hơn bình thường",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "phq9-9",
      text: "Có suy nghĩ rằng bản thân nên chết đi hoặc có ý muốn tự làm hại mình",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 4,
      level: "Tối thiểu",
      description: "Mức độ trầm cảm tối thiểu hoặc không có",
      recommendations: ["Duy trì lối sống lành mạnh", "Tập thể dục thường xuyên", "Ngủ đủ giấc 7-8 tiếng/đêm"],
    },
    {
      min: 5,
      max: 9,
      level: "Nhẹ",
      description: "Mức độ trầm cảm nhẹ",
      recommendations: ["Thực hành thiền định, yoga", "Tăng cường hoạt động xã hội", "Theo dõi tâm trạng hàng ngày"],
    },
    {
      min: 10,
      max: 14,
      level: "Trung bình",
      description: "Mức độ trầm cảm trung bình",
      recommendations: [
        "Tham khảo ý kiến chuyên gia tâm lý",
        "Liệu pháp nhận thức hành vi (CBT)",
        "Hỗ trợ từ gia đình và bạn bè",
      ],
    },
    {
      min: 15,
      max: 19,
      level: "Nặng vừa",
      description: "Mức độ trầm cảm nặng vừa",
      recommendations: [
        "Cần gặp bác sĩ tâm thần ngay",
        "Có thể cần điều trị bằng thuốc",
        "Liệu pháp tâm lý chuyên sâu",
      ],
    },
    {
      min: 20,
      max: 27,
      level: "Nặng",
      description: "Mức độ trầm cảm rất nặng",
      recommendations: [
        "Cần can thiệp y tế khẩn cấp",
        "Điều trị nội trú có thể cần thiết",
        "Theo dõi chặt chẽ nguy cơ tự hại",
      ],
    },
  ],
}