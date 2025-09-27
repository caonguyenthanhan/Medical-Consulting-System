import { Assessment } from "../../types/assessment"

export const scoffAssessment: Assessment = {
  id: "scoff",
  title: "SCOFF - Sàng lọc Rối loạn Ăn uống",
  description: "Bảng câu hỏi sàng lọc các rối loạn ăn uống",
  questions: [
    {
      id: "scoff-1",
      text: "Bạn có bao giờ tự làm mình nôn ói vì cảm thấy no đến khó chịu không?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "scoff-2",
      text: "Bạn có lo lắng rằng mình đã mất kiểm soát về lượng thức ăn nạp vào không?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "scoff-3",
      text: "Gần đây bạn có sụt hơn 6kg trong vòng 3 tháng không?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "scoff-4",
      text: "Bạn có tin rằng mình béo trong khi người khác nói rằng bạn quá gầy không?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "scoff-5",
      text: "Thức ăn có đang chi phối cuộc sống của bạn không?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 1,
      level: "Thấp",
      description: "Ít khả năng có rối loạn ăn uống",
      recommendations: ["Duy trì chế độ ăn cân bằng", "Tập thể dục đều đặn", "Theo dõi cân nặng hợp lý"],
    },
    {
      min: 2,
      max: 5,
      level: "Cao",
      description: "Có thể có rối loạn ăn uống",
      recommendations: ["Cần gặp chuyên gia dinh dưỡng", "Tham khảo bác sĩ tâm thần", "Liệu pháp hành vi nhận thức"],
    },
  ],
}