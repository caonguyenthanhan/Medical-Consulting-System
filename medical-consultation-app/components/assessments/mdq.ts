import { Assessment } from "../../types/assessment"

export const mdqAssessment: Assessment = {
  id: "mdq",
  title: "MDQ - Sàng lọc Rối loạn Khí sắc",
  description: "Bảng câu hỏi sàng lọc rối loạn lưỡng cực và các vấn đề về khí sắc",
  questions: [
    {
      id: "mdq-1",
      text: "Bạn cảm thấy tự tin vào bản thân hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-2",
      text: "Bạn ngủ ít hơn hẳn bình thường và không cảm thấy mệt mỏi hay cần ngủ bù?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-3",
      text: "Bạn nói nhiều hơn hoặc nhanh hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-4",
      text: "Suy nghĩ trong đầu bạn chạy đua dồn dập hoặc bạn không thể làm chậm dòng suy nghĩ của mình?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-5",
      text: "Bạn dễ bị xao nhãng bởi những thứ xung quanh đến mức khó tập trung hoặc đi đúng hướng?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-6",
      text: "Bạn có nhiều năng lượng hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-7",
      text: "Bạn hoạt động nhiều hơn hoặc làm nhiều việc hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-8",
      text: "Bạn trở nên hòa đồng hoặc hướng ngoại hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-9",
      text: "Bạn quan tâm đến tình dục nhiều hơn hẳn bình thường?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-10",
      text: "Bạn làm những việc bất thường hoặc những việc mà người khác cho là quá mức, dại dột, hoặc rủi ro?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
    {
      id: "mdq-11",
      text: "Bạn tiêu tiền đến mức gây rắc rối cho bản thân hoặc gia đình?",
      options: [
        { value: "0", label: "Không", score: 0 },
        { value: "1", label: "Có", score: 1 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 6,
      level: "Thấp",
      description: "Ít khả năng có rối loạn khí sắc",
      recommendations: ["Duy trì lối sống lành mạnh", "Theo dõi tâm trạng hàng ngày", "Ngủ đủ giấc"],
    },
    {
      min: 7,
      max: 13,
      level: "Cao",
      description: "Có thể có rối loạn lưỡng cực",
      recommendations: ["Cần gặp bác sĩ tâm thần", "Đánh giá chuyên sâu", "Theo dõi chu kỳ tâm trạng"],
    },
  ],
}