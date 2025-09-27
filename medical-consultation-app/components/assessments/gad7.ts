import { Assessment } from '../types/assessment'

export const gad7Assessment: Assessment = {
  id: "gad7",
  title: "GAD-7 - Sàng lọc Lo âu",
  description: "Bộ câu hỏi chuẩn để đánh giá mức độ lo âu trong 2 tuần qua",
  questions: [
    {
      id: "gad7-1",
      text: "Cảm thấy bồn chồn, lo lắng, hoặc đứng ngồi không yên",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-2",
      text: "Không thể ngừng hoặc kiểm soát được sự lo lắng",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-3",
      text: "Lo lắng quá nhiều về những điều khác nhau",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-4",
      text: "Gặp khó khăn trong việc thư giãn",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-5",
      text: "Cảm thấy bồn chồn đến mức khó có thể ngồi yên",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-6",
      text: "Trở nên dễ bực bội hoặc cáu kỉnh",
      options: [
        { value: "0", label: "Không bao giờ", score: 0 },
        { value: "1", label: "Vài ngày", score: 1 },
        { value: "2", label: "Hơn nửa số ngày", score: 2 },
        { value: "3", label: "Gần như mỗi ngày", score: 3 },
      ],
    },
    {
      id: "gad7-7",
      text: "Cảm thấy sợ hãi như thể một điều gì đó tồi tệ sắp xảy ra",
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
      description: "Mức độ lo âu tối thiểu",
      recommendations: ["Duy trì thói quen tập thể dục", "Thực hành hít thở sâu", "Giữ lối sống cân bằng"],
    },
    {
      min: 5,
      max: 9,
      level: "Nhẹ",
      description: "Mức độ lo âu nhẹ",
      recommendations: ["Học kỹ thuật thư giãn", "Thiền định 10-15 phút/ngày", "Giảm caffeine và rượu bia"],
    },
    {
      min: 10,
      max: 14,
      level: "Trung bình",
      description: "Mức độ lo âu trung bình",
      recommendations: ["Tham khảo chuyên gia tâm lý", "Liệu pháp thư giãn cơ bắp", "Tham gia nhóm hỗ trợ"],
    },
    {
      min: 15,
      max: 21,
      level: "Nặng",
      description: "Mức độ lo âu nặng",
      recommendations: ["Cần gặp bác sĩ tâm thần", "Có thể cần điều trị thuốc", "Liệu pháp nhận thức hành vi"],
    },
  ],
}