import { Assessment } from "../../types/assessment"

export const asrsAssessment: Assessment = {
  id: "asrs",
  title: "ASRS - Sàng lọc ADHD",
  description: "Thang đo sàng lọc rối loạn tăng động giảm chú ý ở người lớn",
  questions: [
    {
      id: "asrs-1",
      text: "Bạn có thường gặp khó khăn khi hoàn thành những chi tiết cuối cùng của một dự án, sau khi đã làm xong những phần khó nhất không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
    {
      id: "asrs-2",
      text: "Bạn có thường gặp khó khăn trong việc sắp xếp mọi thứ theo thứ tự khi phải thực hiện một công việc đòi hỏi sự tổ chức không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
    {
      id: "asrs-3",
      text: "Bạn có thường gặp vấn đề trong việc ghi nhớ các cuộc hẹn hoặc nghĩa vụ không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
    {
      id: "asrs-4",
      text: "Khi có một công việc đòi hỏi nhiều suy nghĩ, bạn có thường né tránh hoặc trì hoãn việc bắt đầu không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
    {
      id: "asrs-5",
      text: "Bạn có thường hay cựa quậy tay chân hoặc vặn vẹo trên ghế khi phải ngồi một chỗ trong thời gian dài không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
    {
      id: "asrs-6",
      text: "Bạn có thường cảm thấy hoạt động quá mức và buộc phải làm mọi việc, như thể bị 'động cơ' thúc đẩy không?",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Hiếm khi", score: 0 },
        { value: "2", label: "Thỉnh thoảng", score: 0 },
        { value: "3", label: "Thường xuyên", score: 1 },
        { value: "4", label: "Rất thường xuyên", score: 1 },
      ],
    },
  ],
  interpretation: [
    {
      min: 0,
      max: 13,
      level: "Thấp",
      description: "Ít khả năng có ADHD",
      recommendations: ["Duy trì thói quen tốt", "Tập trung cải thiện tổ chức", "Thực hành mindfulness"],
    },
    {
      min: 14,
      max: 24,
      level: "Cao",
      description: "Có thể có ADHD - cần đánh giá chuyên sâu",
      recommendations: ["Gặp bác sĩ tâm thần", "Đánh giá neuropsychological", "Tìm hiểu về liệu pháp ADHD"],
    },
  ],
}